# cluster.yml
    kind: Cluster
    apiVersion: kind.x-k8s.io/v1alpha4
    name: soumyacluster
    nodes:
    - role: control-plane
        extraPortMappings:
        - containerPort: 80   # for HTTP
            hostPort: 80
        - containerPort: 443  # for HTTPS
            hostPort: 443
        kubeadmConfigPatches:
        - |
            kind: InitConfiguration
            nodeRegistration:
            kubeletExtraArgs:
                node-labels: "ingress-ready=true"
    - role: worker
    - role: worker
#
    This is required because the official NGINX ingress manifest for Kind includes:

    nodeSelector:
    ingress-ready: "true"
    So Kubernetes refused to schedule the pod, and the Events showed:

    3 node(s) didn't match Pod's node affinity/selector.
#




### Apply
    kind create cluster --config kind-config.yaml
# Get deployment with local image
    kind load docker-image backend --name soumyacluster
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.5/deploy/static/provider/kind/deploy.yaml
## Wait 
    kubectl wait --namespace ingress-nginx --for=condition=Ready pod --selector=app.kubernetes.io/component=controller --timeout=90s


# backend-service.yaml
    apiVersion: v1
    kind: Service
    metadata:
    name: backend-service
    spec:
    selector:
        app: backend
    ports:
        - protocol: TCP
        port: 80
        targetPort: 3000

### APPLY
    # backend-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: backend-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
    - host: soumya
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 80

