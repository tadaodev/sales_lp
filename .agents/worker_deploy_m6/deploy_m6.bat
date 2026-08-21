@echo off
chcp 65001 > nul
setlocal

echo ============================================================
echo  1. Running 4-Tier Automated Master Test Suite (179 tests)...
echo ============================================================
set PYTHONUTF8=1
python tests\run_all_tests.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Tests failed with exit code %ERRORLEVEL%. Aborting deployment.
    exit /b %ERRORLEVEL%
)

echo.
echo ============================================================
echo  2. Checking Git Status and Staging Files...
echo ============================================================
git status
git add .

echo.
echo ============================================================
echo  3. Committing Changes...
echo ============================================================
git commit -m "feat(flagship): add French Artisan Bakery LP, Washoku Banquet Izakaya LP, expand Portal Hub to 5 flagship LPs, and complete 179-case automated test suite"

echo.
echo ============================================================
echo  4. Pushing to GitHub origin main...
echo ============================================================
git push origin main

echo.
echo ============================================================
echo  5. Verifying Remote Status...
echo ============================================================
git log -1
git status

echo.
echo [SUCCESS] Production deployment and Git push completed successfully!
