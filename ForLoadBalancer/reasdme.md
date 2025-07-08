# Get a Deployment
# Install MetalLB
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.10/config/manifests/metallb-native.yaml

## Get Bridge IP
    docker network inspect kind -f '{{range .IPAM.Config}}{{.Subnet}}{{end}}'


## metallb-config.yaml
    apiVersion: metallb.io/v1beta1
    kind: IPAddressPool
    metadata:
    name: kind-pool
    namespace: metallb-system
    spec:
    addresses:
        - 172.18.255.1-172.18.255.250  # Choose from Docker bridge IP range
    ---
    apiVersion: metallb.io/v1beta1
    kind: L2Advertisement
    metadata:
    name: l2-ad
    namespace: metallb-system
