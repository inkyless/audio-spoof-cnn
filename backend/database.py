from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import time
from sqlalchemy.exc import OperationalError

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

SQL_USER = os.getenv("SQL_USER")
SQL_PASSWORD = os.getenv("SQL_PASSWORD")
SQL_HOST = os.getenv("SQL_HOST")
SQL_PORT = os.getenv("SQL_PORT")
SQL_DATABASE = os.getenv("SQL_DATABASE")

DATABASE_URL = (
    f"mysql+pymysql://{SQL_USER}:{SQL_PASSWORD}@{SQL_HOST}:{SQL_PORT}/{SQL_DATABASE}"
)

MAX_RETRIES = 10
for attempt in range(MAX_RETRIES):
    try:
        engine = create_engine(DATABASE_URL, echo=True, future=True)
        connection = engine.connect()
        print("Connected to MySQL!")
        break
    except OperationalError as e:
        print(f"⏳ Attempt {attempt+1}/{MAX_RETRIES} failed: {e}")
        time.sleep(3)
else:
    raise RuntimeError("Could not connect to the database after several attempts.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
