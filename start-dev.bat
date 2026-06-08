@echo off
echo Starting Wedding Invite Dev Environment...

echo [1/2] Starting Backend (NestJS port 4000)...
start "Backend" cmd /k "cd /d D:\wedding-invite-be && npm run start:dev"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend (Vite port 5174)...
start "Frontend" cmd /k "cd /d D:\wedding-invite && npm run dev -- --port 5174 --host"

timeout /t 8 /nobreak >nul
echo.
echo ==========================================
echo  Frontend: http://localhost:5174
echo  Backend:  http://localhost:4000/api
echo  Admin:    http://localhost:5174/admin
echo ==========================================
echo.
pause
