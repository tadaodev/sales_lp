[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
$env:PYTHONUTF8=1;

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " 1. Running 4-Tier Automated Master Test Suite (179 tests)..." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
python tests/run_all_tests.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed! Aborting deployment." -ForegroundColor Red
    exit 1
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host " 2. Checking Git Status & Staging All Files..." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
git status
git add .

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host " 3. Committing Changes..." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
git commit -m "feat(flagship): add French Artisan Bakery LP, Washoku Banquet Izakaya LP, expand Portal Hub to 5 flagship LPs, and complete 179-case automated test suite"

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host " 4. Pushing to GitHub origin main..." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
git push origin main

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host " 5. Verifying Remote Status..." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
git log -1
git status

Write-Host "`n[SUCCESS] Production deployment and Git push completed successfully!" -ForegroundColor Green
