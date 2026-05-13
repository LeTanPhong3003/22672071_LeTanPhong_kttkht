@echo off
REM Script to run all services for Food Ordering System (Windows)

echo ============================================
echo  Mini Food Ordering System
echo  Service-Based Architecture
echo ============================================
echo.

setlocal enabledelayedexpansion

REM Get the current directory
set ROOT_DIR=%cd%

echo 1. Starting User Service (Port 8081)...
start "User Service" cmd /k "cd !ROOT_DIR!\user-service && npm install && npm start"
timeout /t 2 /nobreak

echo.
echo 2. Starting Food Service (Port 8082)...
start "Food Service" cmd /k "cd !ROOT_DIR!\food-service && npm install && npm start"
timeout /t 2 /nobreak

echo.
echo 3. Starting Order Service (Port 8083)...
start "Order Service" cmd /k "cd !ROOT_DIR!\order-service && npm install && npm start"
timeout /t 2 /nobreak

echo.
echo 4. Starting Payment & Notification Service (Port 8084)...
start "Payment Service" cmd /k "cd !ROOT_DIR!\payment-notification-service && npm install && npm start"
timeout /t 2 /nobreak

echo.
echo 5. Starting Frontend (Port 3000)...
start "Frontend" cmd /k "cd !ROOT_DIR!\frontend && npm install && npm start"
timeout /t 2 /nobreak

echo.
echo ============================================
echo  All services are starting!
echo ============================================
echo.
echo Service URLs:
echo   - User Service: http://localhost:8081/api
echo   - Food Service: http://localhost:8082/api
echo   - Order Service: http://localhost:8083/api
echo   - Payment Service: http://localhost:8084/api
echo   - Frontend: http://localhost:3000
echo.
echo Waiting for services to start...
timeout /t 5 /nobreak

echo.
echo Services should now be running in separate windows.
echo.
