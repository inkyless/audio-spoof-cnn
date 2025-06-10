from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

username = "root"
sql_password = "7#oRIrFqc!uHi9U"
sql_route = "@localhost:3306/"
database_name = "myappdb"

DATABASE_URL = "mysql+pymysql://"+username+":"+sql_password+sql_route+database_name

engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=5, pool_recycle=1800, pool_pre_ping=True, echo=True, future=True)
connection = engine.connect()
print("Connected!")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
