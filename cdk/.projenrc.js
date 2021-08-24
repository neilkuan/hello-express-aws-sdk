const { AwsCdkTypeScriptApp, DependenciesUpgradeMechanism } = require('projen');
const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.119.0',
  defaultReleaseBranch: 'main',
  name: 'cdk',
  cdkDependencies: [
    '@aws-cdk/aws-ecs',
    '@aws-cdk/aws-ecs-patterns',
    '@aws-cdk/aws-ec2',
  ],
  deps: [
    'cdk-fargate-patterns',
  ],
  depsUpgrade: DependenciesUpgradeMechanism.NONE,
});
project.synth();