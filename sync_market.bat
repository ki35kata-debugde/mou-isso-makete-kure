@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo  market_economy.json → HTML 同期
echo ========================================
echo.

set NODE=
if exist "%ProgramFiles%\nodejs\node.exe" set "NODE=%ProgramFiles%\nodejs\node.exe"
if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "NODE=%ProgramFiles(x86)%\nodejs\node.exe"
if "%NODE%"=="" (
  where node >nul 2>&1 && set NODE=node
)
if "%NODE%"=="" (
  echo [エラー] node.exe が見つかりません。
  pause
  exit /b 1
)

echo Node: %NODE%
echo.

if not exist "data\market_economy.json" (
  echo [エラー] data\market_economy.json がありません
  pause
  exit /b 1
)

if exist "data\repair_market_embed.js" (
  echo 市場を安全に再埋め込み...
  "%NODE%" "data\repair_market_embed.js"
  if errorlevel 1 ( echo [失敗] & pause & exit /b 1 )
) else if exist "data\fix_market_season_and_ui.js" (
  echo fix_market_season_and_ui.js ...
  "%NODE%" "data\fix_market_season_and_ui.js"
  if errorlevel 1 ( echo [失敗] & pause & exit /b 1 )
) else (
  echo [エラー] 同期スクリプトがありません
  pause
  exit /b 1
)

echo.
echo ========================================
echo  完了 — Ctrl+F5 でリロード
echo  詳細: docs\データ同期とメンテナンス.md
echo ========================================
pause
