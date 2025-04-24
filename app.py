from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World - Beket - V5!"}

@app.get("/items/")
async def read_items():
    db = SessionLocal()
    try:
        items = db.query(Item).all()
        return {"items": [{"id": item.id, "name": item.name} for item in items]}
    finally:
        db.close()

@app.post("/items/")
async def create_item(name: str):
    db = SessionLocal()
    try:
        item = Item(name=name)
        db.add(item)
        db.commit()
        db.refresh(item)
        return {"id": item.id, "name": item.name}
    finally:
        db.close()

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(
        "app:app",         
        host="0.0.0.0",      
        port=8000,           
        reload=True          
    )