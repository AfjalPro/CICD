from datetime import datetime, timedelta
import os
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, ConfigDict
from sqlalchemy import (
    create_engine, Column, Integer, String, DateTime, ForeignKey
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from dotenv import load_dotenv

load_dotenv()

# Database setup
DATABASE_URL = (
    f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI app
app = FastAPI()

# CORS (allow React dev)
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT & security
SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    posts = relationship("Post", back_populates="owner")

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    image = Column(String, nullable=True)
    content = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="posts")

Base.metadata.create_all(bind=engine)

# Schemas
class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class PostBase(BaseModel):
    title: str
    image: Optional[str] = None
    content: str

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    image: Optional[str] = None
    content: Optional[str] = None

class PostOut(PostBase):
    id: int
    owner_username: str
    date: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Utils

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Dependencies

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user_by_username(db, username: str):
    return db.query(User).filter(User.username == username).first()


def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    creds = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise creds
    except JWTError:
        raise creds
    user = get_user_by_username(db, username)
    if user is None:
        raise creds
    return user

# Auth routes
@app.post("/signup", response_model=Token)
async def signup(user: UserCreate, db=Depends(get_db)):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed = get_password_hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed)
    db.add(db_user); db.commit(); db.refresh(db_user)
    token = create_access_token({"sub": db_user.username}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    user = get_user_by_username(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    token = create_access_token({"sub": user.username}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer"}

# Post CRUD routes
@app.post("/posts/", response_model=PostOut)
async def create_post(
    post: PostCreate,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    db_post = Post(
        **post.dict(),
        owner_id=current_user.id
    )
    db.add(db_post); db.commit(); db.refresh(db_post)
    return PostOut(
        id=db_post.id,
        title=db_post.title,
        image=db_post.image,
        content=db_post.content,
        owner_username=current_user.username,
        date=db_post.date,
        created_at=db_post.created_at
    )

@app.get("/posts/", response_model=List[PostOut])
async def get_posts(
    skip: int = 0,
    limit: int = 100,
    author: Optional[str] = Query(None),
    db=Depends(get_db)
):
    q = db.query(Post)
    if author:
        q = q.join(User).filter(User.username == author)
    posts = q.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    return [PostOut(
        id=p.id,
        title=p.title,
        image=p.image,
        content=p.content,
        owner_username=p.owner.username,
        date=p.date,
        created_at=p.created_at
    ) for p in posts]

@app.get("/posts/{post_id}", response_model=PostOut)
async def get_post(post_id: int, db=Depends(get_db)):
    p = db.query(Post).get(post_id)
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    return PostOut(
        id=p.id,
        title=p.title,
        image=p.image,
        content=p.content,
        owner_username=p.owner.username,
        date=p.date,
        created_at=p.created_at
    )

@app.put("/posts/{post_id}", response_model=PostOut)
async def update_post(
    post_id: int,
    data: PostUpdate,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    p = db.query(Post).get(post_id)
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    if p.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit")
    for k, v in data.dict(exclude_unset=True).items():
        setattr(p, k, v)
    db.commit(); db.refresh(p)
    return PostOut(
        id=p.id,
        title=p.title,
        image=p.image,
        content=p.content,
        owner_username=p.owner.username,
        date=p.date,
        created_at=p.created_at
    )

@app.delete("/posts/{post_id}")
async def delete_post(
    post_id: int,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    p = db.query(Post).get(post_id)
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    if p.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete")
    db.delete(p); db.commit()
    return {"detail": "Post deleted"}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)