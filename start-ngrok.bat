@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo CareLink 跨网络启动脚本
echo ========================================
echo.
echo 这个脚本会：
echo 1. 启动本地服务器
echo 2. 使用 ngrok 暴露到互联网
echo 3. 显示公网访问地址
echo.
echo 前置要求：
echo - 已安装 ngrok（https://ngrok.com/download）
echo - ngrok 在 PATH 中可访问
echo.
pause

REM 检查 ngrok 是否已安装
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ❌ 未找到 ngrok！
    echo.
    echo 请先下载并安装 ngrok：
    echo https://ngrok.com/download
    echo.
    echo 或使用 Chocolatey:
    echo choco install ngrok
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ 已找到 ngrok
echo.
echo 正在启动服务器和 ngrok 隧道...
echo.

REM 启动服务器在后台
start "CareLink Server" cmd /k "node serve.mjs"

REM 等待服务器启动
timeout /t 3 /nobreak

REM 启动 ngrok
ngrok http 3000

pause
