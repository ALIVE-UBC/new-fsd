import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    debug: bool = True
    codegen_jwt_secret: str = "team-skyfall-debug-key-do-not-use-in-production"
    database_url: str = "sqlite+aiosqlite:///./fsd.db"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()