#!/bin/bash

echo "Building and starting the backend with Docker Compose..."

if [ "$1" = "prod" ]; then
    echo "Running in production mode (connecting to host database)..."
    docker-compose -f docker-compose.prod.yml up --build -d
    echo "Backend is running at http://localhost:5001"
    echo "Connected to host database at localhost:3306"
    echo ""
    echo "To stop the services, run: docker-compose -f docker-compose.prod.yml down"
else
    echo "Running in development mode..."
    docker-compose up --build
    echo "Backend is running at http://localhost:5001"
    echo "To stop the services, run: docker-compose down"
fi 