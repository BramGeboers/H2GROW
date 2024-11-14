#!/bin/bash

start "" "C:\Program Files\Git\git-bash.exe" -c "cd ./frontend ; npm i ; npm run dev"
start "" "C:\Program Files\Git\git-bash.exe" -c "docker-compose up"
start "" "C:\Program Files\Git\git-bash.exe" -c "cd ./backend ; mvn spring-boot:run"