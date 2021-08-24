## To start server

```bash
$ npm i
$ npx nodemon source/server.ts
```

### Build to js

```bash
$ npm run-script build
```

### Node to run server

```bash
$ node build/server.js
```

## Note

https://stackoverflow.com/questions/59961939/what-is-the-difference-between-aws-default-region-and-aws-region-system-variable

```bash
# Run on EC2
docker run -p 1337:1337 -e AWS_REGION=[your-aws-region] -e RUNTIME=EC2 -d docker.io/guanyebo/nodejs14-awssts-demo:v2
```

```bash
# Run on ECS (task-role)
docker run -p 1337:1337 -e AWS_REGION=[your-aws-region] -e RUNTIME=ECS -d docker.io/guanyebo/nodejs14-awssts-demo:v2
```

```bash
# Run on ECS Fargate (task-role)
AWS_REGION=[your-aws-region] -d docker.io/guanyebo/nodejs14-awssts-demo:v2
```
