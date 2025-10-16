# database.py
import ssl
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from fastapi import Depends

# ===========================
# Neon Database Configuration
# ===========================
DB_USER = "neondb_owner"              # from Neon GUI
DB_PASSWORD = "npg_k5qcgEu0LSBP"      # from Neon GUI
DB_HOST = "ep-steep-glitter-a1pg3spu-pooler.ap-southeast-1.aws.neon.tech"
DB_NAME = "code_mentor_db"

# SSL context for Neon (required for Neon hosted Postgres)
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Async database URL (asyncpg driver)
DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

# ===========================
# Create Async Engine
# ===========================
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"ssl": ssl_context}  # SSL context explicitly
)

# ===========================
# Async Session Factory
# ===========================
async_session = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,  # prevents attributes from expiring after commit
)

# ===========================
# Declarative Base
# ===========================
Base = declarative_base()

# ===========================
# FastAPI Dependency
# ===========================
async def get_db() -> AsyncSession:
    """
    FastAPI dependency that yields a database session for each request
    and ensures it is closed after the request finishes.
    Usage: db: AsyncSession = Depends(get_db)
    """
    async with async_session() as session:
        yield session