#! /bin/bash

docker-compose down --rmi all

docker rmi $(docker images -a -q)

