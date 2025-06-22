from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import time
from sqlalchemy.exc import OperationalError

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

username = os.getenv("SQL_USER", "root")
sql_password = os.getenv("SQL_PASSWORD")
sql_host = os.getenv("SQL_HOST", "localhost")
sql_port = os.getenv("SQL_PORT", "3306")
database_name = os.getenv("SQL_DATABASE", "myappdb")

DATABASE_URL = f"mysql+pymysql://{username}:{sql_password}@{sql_host}:{sql_port}/{database_name}"

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
