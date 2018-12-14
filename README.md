# ScienceDBStarterPack

This is a collection of skeleton projects and code generators used to get a new
user started with ScienceDb. So far no frontend GUI has been generated. To
example sandbox data model definitions have been provided. You find them in
`./server-graphql-sequelize/code_generator_input`.

Please be aware that this project should serve for two purposes _only_:

1. Be a good basis for creating a manual and evaluating where ScienceDb lacks
   documentation and has bugs.
2. Provide a basis to generate integration tests using Docker.

## What was done to clone and install the skeleton projects and code generators

```
# Front end single page application (VueJS)
git clone git@github.com:ScienceDb/ScienceDbGui.git
# Back end web server (GraphQL)
git clone git@github.com:ScienceDb/server-graphql-sequelize.git
# Code generator for the front-end
git clone git@github.com:ScienceDb/admin_gui_gen.git
cd admin_gui_gen && npm install -g
# Code generator for the back-end
git clone git@github.com:ScienceDb/express_graphql_model_gen.git
cd express_graphql_model_gen && npm install -g
# Central control files, specifically for Docker
git clone git@github.com:ScienceDb/dotfiles.git
```

## Dockerfiles, installation, and starting the whole stack

The central docker-compose file that starts up the whole application is
`./dotfiles/docker-compose.yml`.

From within the directory `./dotfiles` you can build the whole stack with
`docker-compose -f docker-compose.yml build`.
You can run the whole stack with `docker-compose -f docker-compose.yml up`.

The Postgres database is provided within
`./server-graphql-sequelize/Dockerfile.postgres`, the web server is provided
with `./server-graphql-sequelize/Dockerfile.graphql_server`.

The single page application in development mode is provided with
`./ScienceDbGui/Dockerfile`.

### Migrations and manual access to a single container

If you for example want to execute the migrations you will need to do so from
within a running container. Switch to `dotfiles`, and:

```
docker-compose -f docker-compose.yml run --rm science_db_backend bash
```
Now you are within the `science_db_backend` container and can execute
migrations or start node there to interactively try out code.

### Development mode

If you want the web servers GraphQL and VueJS in development mode to
immediately react to changes in your source (code) files, you need to mount
your development source directories into the respective containers. For this
un-comment all `volumes` declarations from the central
`./dotfiles/docker-compose.yml`, e.g.:

```
    # volumes:
    #  - ../ScienceDbGui:/usr/src/app
```

Beware of having a local `./node_modules`, because this would be mounted also
and then conflicts can emerge between npm packages installed in your source
directory and those required or installed inside the Docker container (more
correctly image).
