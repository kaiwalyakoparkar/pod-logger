# pod-logger
A simple dashboard to view and simplify logs from your pod

## Try it out

It's really simple, run the following commands:

```bash
curl -LO https://github.com/kaiwalyakoparkar/pod-logger/blob/main/api/kubernetes/combined.yaml
```

Then apply it to your cluster

```bash
kubectl apply -f podlogger.yaml
```

And voila! You should be able to access the dashboard at `http://<your-cluster-ip>:30080`