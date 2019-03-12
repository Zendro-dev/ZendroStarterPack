#!/bin/bash

# exit on first error
set -e

echo "Installing Data Models and patches"

# color text output constants
# usage example:
# echo -e "${RED} red${NC}"
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Install npm within code generators
#(cd submodules/graphql-server-model-codegen; npm install)
#(cd submodules/single-page-app-codegen; npm install)

function prompt_replace_file(){
    local from=${1}
    local to=${2}
    local file_name=$(basename ${from})

    if [[ -f ${to} ]]
    then
        echo -e "${RED} \"${to}\" already exist, would you like to replace it? (y/n)${NC}"
        read  ANSWER </dev/tty

        if [[ ${ANSWER} =~ ^[Yy]$ ]]
        then
            cp -v  "${from}" "${to}"
        fi
    else
        cp -v  "${from}" "${to}"
    fi
}

# Copy existing validations
if ! [[ -z "$(ls -A data_models/validations/*.js)" ]]
then
    mkdir -p submodules/graphql-server/validations

    ls data_models/validations/*.js | while read path
    do
        file_name=$(basename ${path})
        prompt_replace_file "data_models/validations/${file_name}" "submodules/graphql-server/validations/${file_name}"
    done
fi

# Copy existing patches
if ! [[ -z "$(ls -A data_models/patches/*.js)" ]]
then
    mkdir -p submodules/graphql-server/patches

    ls data_models/patches/*.js | while read path
    do
        file_name=$(basename ${path})
        prompt_replace_file "data_models/patches/${file_name}" "submodules/graphql-server/patches/${file_name}"
    done
fi

# Put seeders
echo "SEEDERS"
mkdir -p submodules/graphql-server/seeders
prompt_replace_file "docker/graphql/create_roles_n_users.js" "submodules/graphql-server/seeders/create_roles_n_users.js"

# Generate code for GraphQL server
(
cd submodules/graphql-server-model-codegen
node index.js generate static-json-files ../graphql-server
node index.js generate ../../data_models/models ../graphql-server
)

# Generate code for SPA server
(
# Generate App code for the integration test models
cd submodules/single-page-app-codegen
node index.js --jsonFiles ../graphql-server-model-codegen/static-json-files ../single-page-app
node index.js --jsonFiles ../../data_models/models ../single-page-app
)