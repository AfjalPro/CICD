from datetime import datetime
import os
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import (
    create_engine, Column, Integer, String, DateTime
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

# Load env
load_dotenv()

DATABASE_URL = (
    f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Post(Base):
    __tablename__ = 'posts'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Schemas
class PostCreate(BaseModel):
    title: str
    content: str

class PostRead(PostCreate):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

# App init
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CRUD endpoints
@app.post('/posts/', response_model=PostRead)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    db_post = Post(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@app.get('/posts/', response_model=List[PostRead])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Post).offset(skip).limit(limit).all()

@app.get('/posts/{post_id}', response_model=PostRead)
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail='Post not found')
    return post

@app.put('/posts/{post_id}', response_model=PostRead)
def update_post(post_id: int, updated: PostCreate, db: Session = Depends(get_db)):
    post = db.query(Post).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail='Post not found')
    post.title = updated.title
    post.content = updated.content
    db.commit()
    db.refresh(post)
    return post

@app.delete('/posts/{post_id}')
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail='Post not found')
    db.delete(post)
    db.commit()
    return {'detail': 'Post deleted'}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)