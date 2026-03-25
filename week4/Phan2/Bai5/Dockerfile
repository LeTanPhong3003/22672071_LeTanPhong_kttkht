FROM golang:1.22 AS builder

WORKDIR /app
COPY go.mod ./
COPY main.go ./

RUN go build -o app .

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/app ./app

EXPOSE 8080
CMD ["./app"]
