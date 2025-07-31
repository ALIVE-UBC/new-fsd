# Falling Skies Visualization Dashboard

## Overview

This project is developed by [Centre for Digital Media](https://thecdm.ca/) students in Summer of 2025 for [University of British Columbia ALIVE Research Lab](https://alivelab.ca/). More information can be found at [the project page](https://thecdm.ca/projects/industry-projects/https://thecdm.ca/projects/falling-skies-25-ubc-alive-research-lab).

This repo contains the source code for the data visualization dashboard for Falling Skies. The site is currently deployed and useable at [https://alive.educ.ubc.ca/fsd2/](https://alive.educ.ubc.ca/fsd2/).

## Local setup instructions

1. git pull this code onto your local machine
2. cd into `frontend`
3. run `npm install` to install all frontend dependencies
4. run `npm run start` to start the frontend
5. Open a new terminal
6. cd into `backend`
7. create a new python virtual environment using `python3 -m venv venv_name`
8. activate the venv. For instance, on Linux the command is `source venv_name/bin/activate`
9. run `pip install -r requirements.txt` to install all backend dependencies
10. run `uvicorn app:app --reload --host 0.0.0.0 --port 8001` to start the backend

## Falling Skies Architecture Explained

The Django app developed by the previous team (FSD1) is referred to as the Data Logging App. This Django app communicates between the iPad game and the database, and logs all the game data. This current app, which is developed using React and FastAPI, communicates with the same database, pulling in the real data to display it in visualizations.

## Deployment for Data Logging (FSD1 App) and Visualization Dashboard (FSD2 App)

## Other information

FSD1's source code is exactly the same as the last group's, except for a model.py. The new model.py is in the [old-fsd branch](https://github.com/ALIVE-UBC/new-fsd/tree/old-fsd). The only change was to add the theorizer events into EventType, so our new theorizer data can be logged properly into the database.
