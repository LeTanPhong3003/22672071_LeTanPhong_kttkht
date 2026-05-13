#!/bin/bash
# Script to run all services for Food Ordering System

echo "🚀 Starting Mini Food Ordering System..."
echo ""

# Create tmux session
tmux new-session -d -s food-ordering

# User Service
echo "📌 Starting User Service (Port 8081)..."
tmux new-window -t food-ordering -n "user-service"
tmux send-keys -t food-ordering:user-service "cd user-service && npm install && npm start" Enter

# Wait for user service to start
sleep 3

# Food Service
echo "📌 Starting Food Service (Port 8082)..."
tmux new-window -t food-ordering -n "food-service"
tmux send-keys -t food-ordering:food-service "cd food-service && npm install && npm start" Enter

# Wait for food service to start
sleep 3

# Order Service
echo "📌 Starting Order Service (Port 8083)..."
tmux new-window -t food-ordering -n "order-service"
tmux send-keys -t food-ordering:order-service "cd order-service && npm install && npm start" Enter

# Wait for order service to start
sleep 3

# Payment & Notification Service
echo "📌 Starting Payment & Notification Service (Port 8084)..."
tmux new-window -t food-ordering -n "payment-service"
tmux send-keys -t food-ordering:payment-service "cd payment-notification-service && npm install && npm start" Enter

# Wait for payment service to start
sleep 3

# Frontend
echo "📌 Starting Frontend (Port 3000)..."
tmux new-window -t food-ordering -n "frontend"
tmux send-keys -t food-ordering:frontend "cd frontend && npm install && npm start" Enter

echo ""
echo "✅ All services are starting!"
echo ""
echo "📍 Service URLs:"
echo "   🔐 User Service: http://localhost:8081/api"
echo "   🍽️ Food Service: http://localhost:8082/api"
echo "   📦 Order Service: http://localhost:8083/api"
echo "   💳 Payment Service: http://localhost:8084/api"
echo "   🌐 Frontend: http://localhost:3000"
echo ""
echo "📋 To view logs, use: tmux attach-session -t food-ordering"
echo "❌ To stop all services, use: tmux kill-session -t food-ordering"
