#!/bin/bash

#----------------------------------------------------------------------------
# setup.sh

#
# NAME
#    setup.sh
# 
# USAGE
#    ./setup.sh
#
# DESCRIPTION
#    Command line utility to get the desired versions of the zendro skeleton projects 


# color constants
LGREEN='\033[1;32m'
NC='\033[0m'
LGRAY='\033[38;5;242m'
RED='\033[0;31m'

# Arguments
## defaults
graphql_server_branch="master"
spa_server_branch="main"
graphiql_branch="master"
while getopts g:s:i: flag
do
    case "${flag}" in
        g) graphql_server_branch=${OPTARG};;
        s) spa_server_branch=${OPTARG};;
        i) graphiql_branch=${OPTARG};;
    esac
done

## Clean directory checks
#
# Msg
echo -e "\n${LGRAY}@@ Checking for clean directory...${NC}"
# Check if graphql-server or single-page-app directory or already exist. If yes abort execution
# Check if graphql-server-<branch> or single-page-app-<branch> already exist (they should'nt). Delete them

if [ -d "graphql-server" ]
then
    # Msg
    echo -e "${LGRAY} Directory ./graphl-server already exists... ${RED}aborting${NC}"
    exit 1
fi

if [ -d "graphql-server-${graphql_server_branch}" ]
then
    rm -r graphql-server-${graphql_server_branch}
fi

if [ -d "single-page-app" ]
then
    # Msg
    echo -e "${LGRAY} Directory ./single-page-app already exists... ${RED}aborting${NC}"
    exit 1
fi

if [ -d "single-page-app-${spa_server_branch}" ]
then
    rm -r single-page-app-${spa_server_branch}
fi
# Msg
echo -e "${LGRAY}@@ ...${LGREEN}done${NC}"

## Add graphql-server skeleton
#
# Msg
echo -e "\n${LGRAY}@@ Adding graphql-server skeleton, branch ${graphql_server_branch}...${NC}"
# get the <branch> archive from github
wget https://github.com/Zendro-dev/graphql-server/archive/${graphql_server_branch}.tar.gz
# extract the folder from the archive
tar xzf ${graphql_server_branch}.tar.gz graphql-server-${graphql_server_branch}
# rename the folder to 'graphql-server'
mv graphql-server-${graphql_server_branch} graphql-server
# copy the seeders into the graphql-server
cp -r seeders graphql-server
# remove the downloaded archive
rm ${graphql_server_branch}.tar.gz
# Msg
echo -e "${LGRAY}@@ Adding graphql-server skeleton... ${LGREEN}done${NC}"

## Add single-page-app skeleton
#
# Msg
echo -e "\n${LGRAY}@@ Adding single-page-app skeleton, branch ${spa_server_branch}...${NC}"
# get the <branch> archive from github
wget https://github.com/Zendro-dev/single-page-app/archive/${spa_server_branch}.tar.gz
# extract the folder from the archive
tar xzf ${spa_server_branch}.tar.gz single-page-app-${spa_server_branch}
# rename the folder to 'graphql-server'
mv single-page-app-${spa_server_branch} single-page-app
# remove the downloaded archive
rm ${spa_server_branch}.tar.gz
# Msg
echo -e "${LGRAY}@@ Adding single-page-app skeleton... ${LGREEN}done${NC}"


## Add graphiql-auth server
#
# Msg
echo -e "\n${LGRAY}@@ Adding graphqiql-auth, branch ${graphiql_branch}...${NC}"
# get the <branch> archive from github
wget https://github.com/Zendro-dev/graphiql-auth/archive/${graphiql_branch}.tar.gz
# extract the folder from the archive
tar xzf ${graphiql_branch}.tar.gz graphiql-auth-${graphiql_branch}
# rename the folder to 'graphql-server'
mv graphiql-auth-${graphiql_branch} graphiql-auth
# remove the downloaded archive
rm ${graphiql_branch}.tar.gz
# Msg
echo -e "${LGRAY}@@  Adding graphqiql-auth... ${LGREEN}done${NC}"
