# Single POD
## Cluster.yml
    kind: Cluster
    apiVersion: kind.x-k8s.io/v1alpha4
    name: soumyacluster
    nodes:
    - role: control-plane
        extraPortMappings:
        - containerPort: 80   # for HTTP
            hostPort: 80
        - containerPort: 443  # for HTTPS (optional)
            hostPort: 443
        - containerPort: 30007  # for HTTPS (optional)
            hostPort: 30007
    - role: worker
    - role: worker

### Run
    kind create cluster --name=soumyacluster --config=cluster.yml
## Load Image
    kind load docker-image backend --name soumyacluster
### Deployment.yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
    name: backend-deployment
    labels:
        app: backend
    spec:
    replicas: 3
    selector:
        matchLabels:
        app: backend
    template:
        metadata:
        labels:
            app: backend
        spec:
        containers:
        - name: backend
            image: backend
            imagePullPolicy: IfNotPresent
            ports:
            - containerPort: 3000

### service.yml
    apiVersion: v1
    kind: Service
    metadata:
    name: my-service
    spec:
    type: NodePort
    selector:
        app: backend
    ports:
        - name: http
        protocol: TCP
        port: 80
        targetPort: 3000
        nodePort: 30007

## Apply POD and Service
    kubectl apply -f deployment.yml     
    kubectl apply -f service.yml     
