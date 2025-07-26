#!/bin/bash

echo "Deploying backend to VM..."

echo "Building Docker image..."
docker build -t alive-backend .

echo "Stopping existing container if running..."
docker stop alive-backend || true
docker rm alive-backend || true

echo "Starting backend container..."
docker run -d \
  --name alive-backend \
  --restart unless-stopped \
  -p 5001:5001 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_USER=root \
  -e DB_PASSWORD=password \
  -e DB_NAME=alive_dashboard \
  --add-host=host.docker.internal:host-gateway \
  alive-backend

echo "Backend deployed successfully!"
echo "Container is running at http://localhost:5001"
echo "Connected to host database at localhost:3306"
echo ""
echo "To view logs: docker logs alive-backend"
echo "To stop: docker stop alive-backend" 