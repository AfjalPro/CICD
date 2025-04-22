# CICD


## Build & push image to docker hub
* Build
```
docker build -t apolitichen/fastapi-postgres-app .
```
* Tag for versioning
```
docker tag apolitichen/fastapi-postgres-app apolitichen/fastapi-postgres-app:1.0
```
* Push the image to docker hub
```
docker push apolitichen/fastapi-postgres-app:1.0
```
* Run docker-compose with pulling the image from docker hub
```
docker-compose up -d
```

## Build image locally and run with docker-compose
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