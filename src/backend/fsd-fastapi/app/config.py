import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    codegen_jwt_secret: str = "your-secret-key-here"
    
    # Use the same database as your existing Django backend
    # Update these values to match your Django database settings
    database_host: str = "localhost"
    database_port: int = 3306
    database_user: str = "root"
    database_password: str = "password"
    database_name: str = "fsd"
    
    @property
    def database_url(self) -> str:
        return f"mysql+asyncmy://{self.database_user}:{self.database_password}@{self.database_host}:{self.database_port}/{self.database_name}"

settings = Settings()