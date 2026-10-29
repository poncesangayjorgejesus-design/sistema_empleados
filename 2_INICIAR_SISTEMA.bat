@echo off
setlocal
title Nexo - Iniciar sistema
if not exist "%~dp0server\node_modules\express\package.json" goto instalar
if not exist "%~dp0client\node_modules\react-scripts\bin\react-scripts.js" goto instalar
echo Inicia MySQL en XAMPP y verifica que importaste base_de_datos.sql.
echo Se abriran dos ventanas. Mantenlas abiertas mientras usas el sistema.
start "Nexo - Servidor" /D "%~dp0server" cmd /k npm.cmd start
start "Nexo - Cliente" /D "%~dp0client" cmd /k npm.cmd start
exit /b 0
:instalar
echo Primero ejecuta 1_INSTALAR_DEPENDENCIAS.bat.
pause
exit /b 1