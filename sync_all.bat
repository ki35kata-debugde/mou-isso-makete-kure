@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo  データ同期（市場 + マップ座標）
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

echo [1/2] 市場 JSON を HTML に埋め込み...
if exist "data\repair_market_embed.js" (
  "%NODE%" "data\repair_market_embed.js"
  if errorlevel 1 ( echo [失敗] repair_market_embed.js & pause & exit /b 1 )
) else (
  echo   skip: repair_market_embed.js なし
)

echo [2/2] マップ座標を再計算...
if exist "data\build_map_cells.js" (
  "%NODE%" "data\build_map_cells.js"
  if errorlevel 1 ( echo [失敗] build_map_cells.js & pause & exit /b 1 )
) else (
  echo   skip: build_map_cells.js なし
)

echo.
echo ========================================
echo  完了
echo  プレイ: mou_isso_v0_6_1.html
echo  ブラウザで Ctrl+F5
echo  詳細: docs\データ同期とメンテナンス.md
echo ========================================
pause
