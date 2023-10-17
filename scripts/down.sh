#/usr/bin/env bash

# 1=dev|prod
# 2=-v
docker compose -f docker-compose-$1.yml down $2
