# Simple Express JS API boilerplate

## Prerequisites

node `>v21.5.0`

Install dependecy packages

```sh
npm i
```

Create the database on your local DB

```sql
CREATE DATABASE mock;
```

## Run Me on local

Run the following commnad to start running the application

```sh
node --env-file=./environments/local/.env src/main.js
```

Or,

```sh
npm run local
```

## Build docker image

```sh
docker build -t tools/express-js-sample -f deployment/Dockerfile .
```

### Run docker image

```sh
docker run -it --name testing -p 3000:3000 --entrypoint node tools/express-js-sample --env-file=./environments/sandbox/.env src/main.js
```

### Deploy in K8s

```sh
kubectl apply -f deployment/k8s.yaml
```

## Observability

```sh
docker run -p 9090:9090 --name=prometheus -v $PWD/observability/prometheus.yaml:/etc/prometheus/prometheus.yml prom/prometheus
```

```sh
docker run --name=grafana -p 3030:3000 grafana/grafana
```

## Test

### Load Testing

For load testing, install artillery using the following command

```sh
npm i -g artillery
```

Then run this to start the load test

```sh
npm run load-test
```

### Unit Test

Run the following command to run the tests

```sh
npm run test
```
