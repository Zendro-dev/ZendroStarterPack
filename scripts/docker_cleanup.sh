#! /bin/bash


# source helper functions and variables
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
source ${SCRIPT_DIR}/misc.sh


# prompt for docker cleanup confirmation
r_echo "This script will stop docker-compose and purge"
r_echo "completely your docker images and containers."
r_echo "Continue? (y/n)"

if ! read_confirm; then exit 0; fi


# shut down both 'development' and 'server' configurations
docker-compose -f ${PROJECT_ROOT}/docker_compose_dev.yml down --rmi all 2> /dev/null
docker-compose -f ${PROJECT_ROOT}/docker_compose_srv.yml down --rmi all 2> /dev/null


# list all docker images and remove them
IMAGES=$(docker images -a -q)

if ! [[ -z "${IMAGES}" ]]
then
    docker rmi $(docker images -a -q) -f
fi

