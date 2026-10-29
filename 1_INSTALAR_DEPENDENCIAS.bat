@echo off
setlocal
title Nexo - Instalar dependencias
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo No se encontro npm. Instala Node.js y vuelve a abrir este archivo.
  pause
  exit /b 1
)
cd /d "%~dp0server"
echo Instalando dependencias del servidor...
call npm.cmd install
if errorlevel 1 goto fallo
cd /d "%~dp0client"
echo Instalando dependencias del cliente React...
call npm.cmd install
if errorlevel 1 goto fallo
echo.
echo Instalacion terminada. Importa el SQL y ejecuta 2_INICIAR_SISTEMA.bat.
pause
exit /b 0
:fallo
echo.
echo No se pudo completar la instalacion. Revisa el error y la conexion a Internet.
pause
exit /b 1