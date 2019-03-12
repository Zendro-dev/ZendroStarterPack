#!/bin/bash

# source helper functions and variables
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
source ${SCRIPT_DIR}/misc.sh

# exit on first error
set -e

if [[ "${1}" != "dev" && "${1}" != "srv" ]]
then
    echo "Installer usage:"
    echo "  install.sh <dev|srv>"
    echo
    echo "  where:"
    echo "  dev - configure server in development mode"
    echo "  srv - configure server in production mode"
else
    rm -f ${PROJECT_ROOT}/docker-compose.yml
    if [[ "${1}" == "dev" ]]; then ln -sv ${PROJECT_ROOT}/docker_compose_dev.yml ${PROJECT_ROOT}/docker-compose.yml; fi
    if [[ "${1}" == "srv" ]]; then ln -sv ${PROJECT_ROOT}/docker_compose_srv.yml ${PROJECT_ROOT}/docker-compose.yml; fi
    echo
    echo
fi

echo "Installing Data Models and patches"


# Install npm within code generators
(cd ${PROJECT_ROOT}/submodules/graphql-server-model-codegen; npm install)
(cd ${PROJECT_ROOT}/submodules/single-page-app-codegen; npm install)



# Migrate project-specific validations
prompt_migrate_folder \
    "${PROJECT_ROOT}/data_models/validations" \
    "${PROJECT_ROOT}/submodules/graphql-server/validations"


# Migrate project-specific patches
prompt_migrate_folder \
    "${PROJECT_ROOT}/data_models/patches" \
    "${PROJECT_ROOT}/submodules/graphql-server/patches"



# Install project-specific seeders (initial values for some models)
prompt_migrate_folder \
    "${PROJECT_ROOT}/data_models/seeders" \
    "${PROJECT_ROOT}/submodules/graphql-server/seeders"



# Generate model-specific code for GraphQL server
(
cd submodules/graphql-server-model-codegen
node index.js generate static-json-files ../graphql-server
node index.js generate ../../data_models/models ../graphql-server
)



# Generate model-specific code for SPA server
(
# Generate App code for the integration test models
cd submodules/single-page-app-codegen
node index.js --jsonFiles ../graphql-server-model-codegen/static-json-files ../single-page-app
node index.js --jsonFiles ../../data_models/models ../single-page-app
)