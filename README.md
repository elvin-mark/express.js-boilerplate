```sh
docker build -t tools/express-js-sample -f deployment/Dockerfile .
```

```sh
docker run -it --name testing -p 3000:3000 -e NODE_ENV=sandbox tools/express-js-sample
```

```sh
kubectl apply -f deployment/k8s.yaml
```
