FROM node:11.6.0-alpine


# Create app directory
WORKDIR /usr/src/app

# Copy source code
COPY submodules/single-page-app/ .

# Install dependencies
RUN apk update && apk add git && apk add bash
RUN rm -rvf .git
RUN npm install npm@6.0.0
RUN npm install

EXPOSE 8080