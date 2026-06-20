@echo off
echo ====================================================
echo           ShaheenShield - Presentation Mode
echo ====================================================
echo.
echo * Running in 100%% offline client-side simulation.
echo * No Docker Desktop or backend API server required!
echo * All database operations will save/load to browser localStorage.
echo.
echo Starting Next.js frontend dev server...
echo.

call npm.cmd run dev
