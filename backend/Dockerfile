FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    pkg-config \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements-backend.txt .

RUN pip install --no-cache-dir -r requirements-backend.txt

COPY . .

EXPOSE 5001

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5001"] 
