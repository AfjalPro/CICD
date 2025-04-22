# CICD


## replicate inside docker-compose
* run (-d for detached mode)
```
docker-compose up -d --build
```
* initialize the db (run once)
```
docker-compose exec app python -c "from app import Base, engine; Base.metadata.create_all(bind=engine)"
```
* stop
```
docker-compose down
```

## postgres2 - save credentials in `.env`

Test postgres with endpoints:
* `curl -X POST "http://localhost:8000/items/?name=TestItem"`
* `curl "http://localhost:8000/items/"`

## replicate inside docker:
* build
```
docker build -t fastapi-app .
```
* run (-d for detached mode)
```
docker run -d -p 8000:8000 --name my-fastapi fastapi-app
```
* stop
```
docker stop my-fastapi
```

## replicate manually:
```
python -m venv env
source env/bin/activate
pip install -r requirements.txt
python app.py
```