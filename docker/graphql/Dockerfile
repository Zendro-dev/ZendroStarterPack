FROM node:11.9.0-stretch-slim

# Create app directory
WORKDIR /usr/src/app

COPY submodules/graphql-server/ .
COPY docker/graphql/run_graphql.sh .
COPY docker/graphql/config.json ./config/config.json
COPY docker/graphql/globals.js ./config/globals.js
COPY docker/graphql/acl_rules.js .

# Clone the skeleton project and install dependencies
RUN apt-get update && apt-get install -y git procps
RUN chmod u+x ./run_graphql.sh
RUN rm -rvf .git
RUN npm install

EXPOSE 3000