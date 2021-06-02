@echo off

@REM check if package is installed locally.
for /f %%i in ('npm root') do set install_path=%%i

@REM if not installed locally, set install path to global one
setlocal enabledelayedexpansion
if not exist !install_path!\protoc-gen-ts\  (
    for /f %%i in ('npm root -g') do set install_path=%%i
)
endlocal & set install_path=%install_path%

@REM invoke the index.js 
node %install_path%\protoc-gen-ts\src\index