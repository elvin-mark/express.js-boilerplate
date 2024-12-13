# Simple Express JS API boilerplate

## Prerequisites

node `>v21.5.0`

Install dependecy packages

```sh
npm i
```

## Run Me on local

```sh
node --env-file=./environments/local/.env src/main.js
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
