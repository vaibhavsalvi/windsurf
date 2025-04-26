#!/bin/bash

echo "Starting development environment..."

# Kill existing processes
echo "Cleaning up existing processes..."
pkill -f "java.*CacheApplication" || true
pkill -f "node.*next" || true

# Start Java backend
echo "Starting Java backend..."
cd java-cache
mvn spring-boot:run &
JAVA_PID=$!

# Wait for Java server to be ready
echo "Waiting for Java server to start..."
while ! curl -s http://localhost:8080/api/cache/size > /dev/null; do
    sleep 1
done
echo "Java server is ready!"

# Start Next.js frontend
echo "Starting Next.js frontend..."
cd ..
npm run dev &
NEXT_PID=$!

# Wait for Next.js server to be ready
echo "Waiting for Next.js server to start..."
while ! curl -s http://localhost:3000 > /dev/null; do
    sleep 1
done
echo "Next.js server is ready!"

echo "Development environment is ready!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8080"

# Keep script running
wait
