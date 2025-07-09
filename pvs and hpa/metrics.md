kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl autoscale deployment backend-deployment \
  --cpu-percent=50 \
  --min=1 \
  --max=5
kubectl patch deployment metrics-server -n kube-system --type=json --patch '[{"op": "add", "path": "/spec/template/spec/containers/0/args/-", "value": "--kubelet-insecure-tls"}]'
