#!/usr/bin/env bash

# 1=dev|prod
# 2=<service_name>
docker compose -f docker-compose-$1.yml kill $2
wait
docker compose -f docker-compose-$1.yml rm $2
wait
docker compose -f docker-compose-$1.yml up -d --renew-anon-volumes $2
