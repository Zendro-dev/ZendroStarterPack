#/usr/bin/env bash

# 1=dev|prod

docker compose -f docker-compose-$1.yml up -d \
  --remove-orphans \
  --force-recreate \
  --renew-anon-volumes
