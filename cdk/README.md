# This for testing express app runtime config.

## To install
```bash
yarn
```

## To diff
```bash
cdk diff
```

## To deploy
```bash
cdk deploy

--- example output ---

 ✅  my-stack-dev

Outputs:
my-stack-dev.FargateExternalEndpointA658D731 = http://my-st-Farga-62FBR0V3YB2K-1106103230.ap-northeast-1.elb.amazonaws.com
my-stack-dev.checkUseECSFargateTaskRole = curl http://my-st-Farga-62FBR0V3YB2K-1106103230.ap-northeast-1.elb.amazonaws.com/sample/whoami
my-stack-dev.checkUseECSTaskRole = curl http://my-st-servi-QYELWYOEDG2S-135954593.ap-northeast-1.elb.amazonaws.com/sample/whoami
my-stack-dev.serviceLoadBalancerDNS7A375B34 = my-st-servi-QYELWYOEDG2S-135954593.ap-northeast-1.elb.amazonaws.com
my-stack-dev.serviceServiceURLD17005C1 = http://my-st-servi-QYELWYOEDG2S-135954593.ap-northeast-1.elb.amazonaws.com
```

## Check use ECS task role (EC2)
```bash
curl http://my-st-servi-xxxxx-xxxx.ap-xxxx-1.elb.amazonaws.com/sample/whoami
{"message":"You are authenticated as arn:aws:sts::123456789012:assumed-role/my-stack-dev-fargatetasksTaskRole84C07681-1D6S8DFE7PSQ1/19d0d74121ad47eba2d7e5fc641a0da5"}
```

## Check use ECS task role (Fargate)
```bash
curl http://my-st-Farga-xxxxx-xxxx.ap-xxxx-1.elb.amazonaws.com/sample/whoami
{"message":"You are authenticated as arn:aws:sts::123456789012:assumed-role/my-stack-dev-fargatetasksTaskRole84C07681-1D6S8DFE7PSQ1/19d0d74121ad47eba2d7e5fc641a0da5"}
```

## To destroy
```bash
cdk destrpy 
```