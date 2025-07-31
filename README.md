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

This app is deployed on a UBC VM using nginx. The frontend is served via a React static build, and the backend is served at port 5001. In order to redeploy a new version after the source code has been modified, please do the following steps:

0. run `cd /opt/fsd2/new-fsd/` to go to the source code folder.
1. `git pull` the new changes
2. cd into `frontend`
3. run `npm run build`. This generates static build files; the new frontend has been successfully deployed as of this step. nginx has been configured to automatically use the build files at this location
4. cd into `backend`
5. run `sudo systemctl restart fsd2-backend.service`
6. OPTIONAL: run `sudo nginx -t` to test for errors
7. run `sudo systemctl reload nginx` to reload the backend, which is being served dynamically. 
8. Done! You have now redeployed

## Other information

FSD1's source code is exactly the same as the last group's, except for a model.py. The new model.py is in the [old-fsd branch](https://github.com/ALIVE-UBC/new-fsd/tree/old-fsd). The only change was to add the theorizer events into EventType, so our new theorizer data can be logged properly into the database.

The source code for both FSD apps is located at `/opt`

The nginx conf file is located at `/etc/nginx/sites` on the VM.

```
server {
  listen 80;
  server_name alive.educ.ubc.ca;

  include conf.d/lets-encrypt.conf;
}

server {
  listen 443 ssl http2;
  server_name alive.educ.ubc.ca;

  # Let's Encrypt
  ssl_certificate /etc/acme-tiny/alive.educ.ubc.ca.crt;
  ssl_certificate_key /etc/acme-tiny/alive.educ.ubc.ca.key;

  # FSD2 API proxy
  location /fsd2/api/ {
    proxy_pass http://localhost:5001/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

location /fsd2/ {
    alias /opt/fsd2/new-fsd/frontend/dist/;
    index index.html;
    try_files $uri $uri/ @fsd2_fallback;
}

location @fsd2_fallback {
    rewrite ^/fsd2/(.*)$ /fsd2/index.html last;
}

  location /fsd/static/ {
    alias /opt/fsd/static/;
    access_log off;
    expires 30d;
 }
 
  # Original FSD app
  location /fsd/ {
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:8028;
  }

  # WordPress site at root
  root /var/www/html;

  # WordPress PHP processing
  location ~ \.php$ {
    include fastcgi_params;
    fastcgi_intercept_errors on;
    fastcgi_pass php-fpm;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
  }

  # WordPress root location - must come last
  location / {
    index index.html index.php;
    try_files $uri $uri/ /index.php?$args;
  }
}
```

If FSD1 (the Django app)'s source code has been updated, use a similar method to redeploy:

1. run `sudo systemctl restart oldfsd.service`
2. OPTIONAL: run `sudo nginx -t` to test for errors
3. run `sudo systemctl reload nginx`