# CICD

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