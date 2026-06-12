#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Starting TrailVerse India Backend Deployment ==="

# 1. Pull latest code from main branch
echo "Pulling latest code changes..."
git pull origin main

# 2. Re-create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating environment template file. Please fill in credentials inside .env!"
    cp .env.example .env
    exit 1
fi

# 3. Build and launch Docker containers in background
echo "Building and launching containers..."
docker-compose down
docker-compose up --build -d

# 4. Wait for database to initialize
echo "Waiting for PostgreSQL database container to boot..."
sleep 5

# 5. Run Prisma Migrations inside the app container
echo "Running Prisma migration schema updates..."
docker-compose exec -T app npx prisma migrate deploy

echo "=== Deployment Completed Successfully ==="
