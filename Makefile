run:
	node --env-file=./environments/local/.env src/main.js

build-docker:
	docker build -t tools/express-js-sample -f deployment/Dockerfile .

run-image:
	docker run -it --name testing -p 3000:3000 --entrypoint node tools/express-js-sample --env-file=./environments/sandbox/.env src/main.js

deploy:
	kubectl apply -f deployment/k8s.yaml

delete-deploy:
	kubectl delete -f deployment/k8s.yaml

run-prometheus:
	docker run -p 9090:9090 --name=prometheus -v $PWD/observability/prometheus.yaml:/etc/prometheus/prometheus.yml prom/prometheus

run-grafana:
	docker run --name=grafana -p 3030:3000 grafana/grafana
