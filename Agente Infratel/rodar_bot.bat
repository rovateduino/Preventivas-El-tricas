@echo off
title Bot Infratel
REM Rodar diretamente da raiz do projeto
set PLAYWRIGHT_BROWSERS_PATH=%~dp0.playwright-browsers
python bot.py %*
pause