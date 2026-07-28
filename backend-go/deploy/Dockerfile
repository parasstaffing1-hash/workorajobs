# Stage 1: Build binary
FROM golang:1.26-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git ca-certificates

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /app/bin/server ./cmd/server
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /app/bin/worker ./cmd/worker

# Stage 2: Production runtime image (~15MB)
FROM alpine:3.20

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

COPY --from=builder /app/bin/server /app/server
COPY --from=builder /app/bin/worker /app/worker
COPY --from=builder /app/.env /app/.env 2>/dev/null || true

EXPOSE 8080

ENTRYPOINT ["/app/server"]
