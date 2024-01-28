FROM golang:1.19

# Set destination for COPY
WORKDIR /

# Download Go modules
COPY . .

EXPOSE 8080

RUN go get .

RUN go build -o podlogger-api

# Run
CMD ["./podlogger-api"]