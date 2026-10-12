@echo off
echo ========================================================
echo Starting EduPulse — AI-Powered Test-to-Action Platform
echo "Every test should lead to a better next step."
echo Target: Kurnool Coaching Centres, Andhra Pradesh, India
echo ========================================================

echo.
echo 1. Launching FastAPI Backend on http://localhost:8000...
start "EduPulse Backend" cmd /k "cd backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo.
echo 2. Launching Vite Frontend on http://localhost:5173...
start "EduPulse Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo EduPulse services launched!
echo Access the application at: http://localhost:5173
echo API documentation at:       http://localhost:8000/docs
echo ========================================================
pause
