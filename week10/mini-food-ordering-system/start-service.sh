#!/bin/bash
# Individual service startup scripts

echo "=========================================="
echo "  Food Ordering System - Service Starter"
echo "=========================================="
echo ""
echo "Choose a service to start:"
echo "1. User Service (8081)"
echo "2. Food Service (8082)"
echo "3. Order Service (8083)"
echo "4. Payment Service (8084)"
echo "5. Frontend (3000)"
echo "6. All Services"
echo ""
read -p "Enter choice (1-6): " choice

case $choice in
  1)
    echo "Starting User Service..."
    cd user-service
    npm install
    npm start
    ;;
  2)
    echo "Starting Food Service..."
    cd food-service
    npm install
    npm start
    ;;
  3)
    echo "Starting Order Service..."
    cd order-service
    npm install
    npm start
    ;;
  4)
    echo "Starting Payment Service..."
    cd payment-notification-service
    npm install
    npm start
    ;;
  5)
    echo "Starting Frontend..."
    cd frontend
    npm install
    npm start
    ;;
  6)
    echo "Starting all services..."
    chmod +x run-all.sh
    ./run-all.sh
    ;;
  *)
    echo "Invalid choice!"
    ;;
esac
