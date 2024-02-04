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

# Read this Pod's namespace
ENV NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# Read the ServiceAccount bearer token
ENV TOKEN=$(cat ${SERVICEACCOUNT}/token)

# Reference the internal certificate authority (CA)
ENV CACERT=${SERVICEACCOUNT}/ca.crt

CMD [curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" ${APISERVER}/api] 

# Run
CMD ["./podlogger-api"]