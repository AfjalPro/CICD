docker buildx create --use 
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t apolitichen/fastapi-postgres-app:latest \
  --push .  