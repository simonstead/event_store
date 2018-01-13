# No containers

To work on any of the components that talk to the event store, you could just

```bash
cd register
yarn
nodemon start
```

This is faster than rebuilding containers all the time.

# Docker compose

simply

```bash
docker-compose up
```

if minikube has been on you'll want to

```bash
minikube stop
eval $(minikube docker-env -u)
docker-compose build
docker-compose up
```

# Local Kubernetes

You might need to

```bash
minikube start --vm-driver=xhyve
eval $(minikube docker-env)
```

## Install redis

```bash
helm install redis
```

OR

```bash
k create -f ./kompose/redis-deployment.yaml
k create -f ./kompose/redis-service.yaml
```

## Then make the deployments and services for the 3 parts (build docker images first).

```bash
k run user-list --image event-store:v1 --port=3000
docker build -t event-store:v1 ./event_store/
k expose deployment event-store --type=LoadBalancer
```

```bash
k run user-list --image user-list:v1 --port=3002
docker build -t user-list:v1 ./user_list/
k expose deployment user-list --type=LoadBalancer
```

```bash
k run user-list --image register:v1 --port=3001
docker build -t register:v1 ./register/
k expose deployment register --type=LoadBalancer
```

See
<https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/#create-a-deployment>
if you get stuck
