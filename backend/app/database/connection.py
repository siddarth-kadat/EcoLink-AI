from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config.settings import settings

# Database URL from configured settings
DATABASE_URL = settings.DATABASE_URL

# Create the SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Check connection health before using
    pool_recycle=3600,   # Recycle connections after an hour
)

# Create the SessionLocal class for database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    """
    Dependency generator to get database session.
    Will yield a SessionLocal instance when configured.
    """
    if SessionLocal is None:
        raise RuntimeError("Database SessionLocal has not been configured yet.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
