#!/bin/bash

echo "Building and starting the backend with Docker Compose..."

docker-compose up --build

echo "Backend is running at http://localhost:5001"
echo "Database is running at localhost:3306"
echo ""
echo "To stop the services, run: docker-compose down" 