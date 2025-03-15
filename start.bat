@echo off
color 2

cd %cd%/system

node nodejscuccok.js

ping localhost -n 2 >nul
pause