FROM golang:1.19

# Set destination for COPY
WORKDIR /

# Download Go modules
COPY ./api .

EXPOSE 8080

RUN go get .

RUN go build -o podlogger-api

ENV APISERVER=https://kubernetes.default.svc

# Path to ServiceAccount token
ENV SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

ENV NAMESPACE=/var/run/secrets/kubernetes.io/serviceaccount/namespace

ENV TOKEN=/var/run/secrets/kubernetes.io/serviceaccount/token

ENV CACERT=/var/run/secrets/kubernetes.io/serviceaccount/ca.crt

# ENV PN logger

# ENV NS default

# Run
CMD ["./podlogger-api"]