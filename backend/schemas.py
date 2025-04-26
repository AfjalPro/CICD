from datetime import datetime
from pydantic import BaseModel

class PostCreate(BaseModel):
    title: str
    content: str

class PostRead(PostCreate):
    id: int
    created_at: datetime
    owner_id: int 

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str