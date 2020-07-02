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
#    Command line utility to get the latest-stable versions of the zendro skeleton projects 


# color constants
LGREEN='\033[1;32m'
NC='\033[0m'
LGRAY='\033[38;5;242m'
RED='\033[0;31m'

## Clean directory checks
#
# Msg
echo -e "\n${LGRAY}@@ Checking for clean directory...${NC}"
# Check if graphql-server or single-page-app directory or already exist. If yes abort execution
# Check if graphql-server-latest-stable or single-page-app-latest-stable already exist (they should'nt). Delete them
# . Delete latest-stable.tar.gz if it exists
if [ -f "latest-stable.tar.gz" ]
then
    rm latest-stable.tar.gz
fi

if [ -d "graphql-server" ]
then
    # Msg
    echo -e "${LGRAY} Directory ./graphl-server already exists... ${RED}aborting${NC}"
    exit 1
fi

if [ -d "graphql-server-latest-stable" ]
then
    rm -r graphql-server-latest-stable
fi

if [ -d "single-page-app" ]
then
    # Msg
    echo -e "${LGRAY} Directory ./single-page-app already exists... ${RED}aborting${NC}"
    exit 1
fi

if [ -d "single-page-app-latest-stable" ]
then
    rm -r single-page-app-latest-stable
fi
# Msg
echo -e "${LGRAY}@@ ...${LGREEN}done${NC}"

## Add graphql-server skeleton
#
# Msg
echo -e "\n${LGRAY}@@ Adding graphql-server skeleton...${NC}"
# get the latest stable archive from github
wget https://github.com/ScienceDb/graphql-server/archive/latest-stable.tar.gz
# extract the folder from the archive
tar xzf latest-stable.tar.gz graphql-server-latest-stable
# rename the folder to 'graphql-server'
mv graphql-server-latest-stable graphql-server
# remove the downloaded arvhice
rm latest-stable.tar.gz
# Msg
echo -e "${LGRAY}@@ Adding graphql-server skeleton... ${LGREEN}done${NC}"

## Add single-page-app skeleton
#
# Msg
echo -e "\n${LGRAY}@@ Adding single-page-app skeleton...${NC}"
# get the latest stable archive from github
wget https://github.com/ScienceDb/single-page-app/archive/latest-stable.tar.gz
# extract the folder from the archive
tar xzf latest-stable.tar.gz single-page-app-latest-stable
# rename the folder to 'graphql-server'
mv single-page-app-latest-stable single-page-app
# remove the downloaded arvhice
rm latest-stable.tar.gz
# Msg
echo -e "${LGRAY}@@ Adding single-page-app skeleton... ${LGREEN}done${NC}"


## Add single-page-app skeleton
#
# Msg
echo -e "\n${LGRAY}@@ Adding graphqiql-auth...${NC}"
# get the latest stable archive from github
wget https://github.com/ScienceDb/graphiql-auth/archive/latest-stable.tar.gz
# extract the folder from the archive
tar xzf latest-stable.tar.gz graphiql-auth-latest-stable
# rename the folder to 'graphql-server'
mv graphiql-auth-latest-stable graphiql-auth
# remove the downloaded arvhice
rm latest-stable.tar.gz
# Msg
echo -e "${LGRAY}@@  Adding graphqiql-auth... ${LGREEN}done${NC}"
