# FallingSkies Backend - FastAPI Version

FastAPI port of the FallingSkies Backend (fsd), serving as the control centre for the FallingSkies game.

## Features

- **Access Code Generation**: JWT-based secure access codes for game clients
- **Metrics Collection**: Comprehensive event tracking and analytics
- **Survey Interface**: Web forms for user data collection
- **RESTful API**: Modern API design with automatic documentation

## Installation

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8028
   ```

3. Access the application:
   - Main interface: http://localhost:8028
   - API documentation: http://localhost:8028/docs
   - Survey form: http://localhost:8028/survey

## Configuration

Set the JWT secret key in your environment or modify `app/config.py`:
```bash
export CODEGEN_JWT_SECRET="your-secret-key-here"
```

## API Endpoints

- `GET /survey` - Survey form interface
- `POST /codegen/survey` - Submit survey data
- `GET /codegen/generate` - Generate access code
- `GET /codegen/qualtrics` - Qualtrics integration
- `PUT /metrics/events` - Submit game events