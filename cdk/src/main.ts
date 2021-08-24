import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsp from '@aws-cdk/aws-ecs-patterns';
import { App, Construct, Stack, StackProps, CfnOutput } from '@aws-cdk/core';
import { DualAlbFargateService } from 'cdk-fargate-patterns';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // Mydefault VPC not have nat gateway.
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true });
    // EC2 Container Service Part.
    const tasks = new ecs.Ec2TaskDefinition(this, 'task', {
    });
    tasks.addContainer('web', {
      portMappings: [{ containerPort: 1337 }],
      image: ecs.ContainerImage.fromRegistry('guanyebo/nodejs14-awssts-demo:v2'),
      environment: {
        RUNTIME: 'ECS',
        AWS_REGION: this.region,
      },
      memoryLimitMiB: 512,
    });
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
      capacity: {
        instanceType: new ec2.InstanceType('t3.small'),
        machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
        desiredCapacity: 1,
      },
    });

    const my = new ecsp.ApplicationLoadBalancedEc2Service(this, 'service', {
      cluster,
      taskDefinition: tasks,
      serviceName: 'demo',
      desiredCount: 1,
      publicLoadBalancer: true,
    });
    my.targetGroup.configureHealthCheck({
      path: '/sample/health',
    });

    // Fargate Port.
    const fargatetasks = new ecs.FargateTaskDefinition(this, 'fargatetasks', {
      cpu: 256,
      memoryLimitMiB: 512,
    });
    fargatetasks.addContainer('web', {
      portMappings: [{ containerPort: 1337 }],
      image: ecs.ContainerImage.fromRegistry('guanyebo/nodejs14-awssts-demo:v2'),
      environment: {
        AWS_REGION: this.region,
      },
    });
    const fa =new DualAlbFargateService(this, 'Fargate', {
      cluster,
      spot: true,
      spotTerminationHandler: false,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      tasks: [{
        external: { port: 80 },
        task: fargatetasks,
        healthCheck: {
          path: '/sample/health',
        },
      }],
      route53Ops: {
        enableLoadBalancerAlias: false,
      },
    });

    new CfnOutput(this, 'checkUseECSTaskRole', {
      value: `curl http://${my.loadBalancer.loadBalancerDnsName}/sample/whoami`,
    });

    new CfnOutput(this, 'checkUseECSFargateTaskRole', {
      value: `curl http://${fa.externalAlb?.loadBalancerDnsName}/sample/whoami`,
    });

  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'my-stack-dev', { env: devEnv });
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();