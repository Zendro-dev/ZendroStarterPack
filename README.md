# ScienceDBStarterPack

This is a collection of skeleton projects and code generators used to get a new
user started with ScienceDb. To
example sandbox data model definitions have been provided. You find them in
`./data_model_definitions/`.

## Prerequisites

You should have basic knowledge of the following technology-stack:
* [`Node.js`](https://nodejs.dev/)
* [`GraphQL`](https://graphql.org/)
* [`Vue.js`](https://vuejs.org/)
* [`docker`](https://www.docker.com/)
* [`git`](https://git-scm.com/), especially "git submodules"
* [`Linux Shell`](https://en.wikipedia.org/wiki/Bash_(Unix_shell))

_Note_, that this project is meant to be used on a `*nix` system, preferably
Linux.

## Install and init git submodules

First you need to `git clone` this project into a local directory on your host
system:
```
git clone https://github.com/ScienceDb/ScienceDbStarterPack.git
```

The skeleton GraphQL server and the single page application server projects are
managed as `git submodule`s. "Skeleton" means that these projects provide all
the code needed to start a server, but actually have no code particular to any
data model. This "particular" code you will generate with ScienceDb's code
generators (see below).

_Note_ that using git submodules is a good solution for this Starter-Pack
project. Nonetheless, as git developers themselves admit "Using submodules
isn’t without hiccups, however." See [the official git book, chapter
submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) for more
details on git submodules.

Setup the skeleton servers:
```
git submodule init
git submodule update --init --recursive
```

### Update submodules to latest remote repository versions

If you want to update your skeleton server projects managed as git submodules
to the latest remote repository version, run the following command:
```
git submodule foreach git pull origin master
```

### Start your own branch of the servers 

To correctly manage your code with git you will need to create your own
branches of the servers. Furthermore, you might have to add your own remote
repository to which to push your new code.

To achieve this the most recommendable way is to fork the two server projects
on github:
* [`graphql-server`](https://github.com/ScienceDb/graphql-server)
* [`single-page-application`](https://github.com/ScienceDb/single-page-app)

Then update your submodules (the servers) to track your own forked version of
the two repositories. To update the git URLs simply edit the file `.gitmodules`.
For example change 
```
[submodule "graphql-server"]
  path = graphql-server
  url = https://github.com/ScienceDb/graphql-server.git
```
to
```
[submodule "graphql-server"]
  path = graphql-server
  url = https://github.com/MyGitHubName/graphql-server.git
```

Then run the following commands:
```
git submodule sync
git submodule update --init --recursive --remote
```

#### Switch to a new feature-branch

```
git submodule foreach 'git checkout -b featureA'
```

## Install the code generators within a dedicated Docker image

To avoid having to install the ScienceDb code-generators on your host system we
provide a dedicated Docker image in which two code generators are installed and
ready to be used. 

```
docker build -f Dockerfile.code-generators -t sciencedb-code-generators:latest .
```

## Define your data models

Within the directory `./data_model_definitions` you can place your data model
definitions in respective `JSON` files. To learn more about how to define data
models with ScienceDb please see our [manual and
documentation](https://sciencedb.github.io/).

### Use default user and roles

We strongly recommend using the default data models `user.json` and
`role.json`. This gives you a ready to login and secure set of servers.

If you choose to follow the recommendation, you should edit the Sequelize
seeder `./seeders/20190225162439-create_roles_n_users.js` to create your
default admin-user and default roles.

It is _most important_ that you then copy the seeder into the graphql-server
code dir:
```
cp -r ./seeders ./graphql-server
```

### Generate the code

Using the dedicated Docker image in which the code generators are installed you
can invoke them on the data model definitions you placed in the
`data_model_definitions` directory.

Whenever you make changes to your data model definitions or update the code
generators and/or skeleton server projects `graphql-server` or
`single-page-app`, you should repeat the following code generation.

#### Generate the GraphQL server

```
docker run --rm -v `pwd`:/opt --user 1000:1000 sciencedb-code-generators:latest 
graphql-server-model-codegen generate /opt/data_model_definitions /opt/graphql-server
```

#### Generate the Single Page Application (SPA) server

```
docker run --rm -v `pwd`:/opt --user 1000:1000 sciencedb-code-generators:latest 
single-page-app-codegen --jsonFiles /opt/data_model_definitions /opt/single-page-app
```

## Start the servers

Upon starting the servers in any mode development or production any pending
database migrations and seeding is automatically triggered. See file
`./graphql-server/migrateDbAndStartServer.sh`, and the two docker-compose files
`docker-compose-dev.yml` (development) and `docker-compose.yml` (production).

### Setup

If you do not run the development, and definitely later the production
environment, on `localhost`, you need to tell the single page application which
URLs to use for login and to send GraphQL queries to. This is controlled by the
following environment variables of `sdb_science_db_app_server` in the two
docker-compose files.

* `VUE_APP_SERVER_URL=http://localhost:3000/graphql`
* `VUE_APP_LOGIN_URL=http://localhost:3000/login`
* `VUE_APP_MAX_UPLOAD_SIZE=500`

For more details see our [manual](https://sciencedb.github.io/) and the
[single-page-application
`README`](https://github.com/ScienceDb/single-page-app/blob/master/README.md).


#### Access Control

ScienceDb can be used checking access rights for every single GraphQL query
received by the currently logged in user identified by the respective [JSON Web
Token](https://jwt.io/) found in the request header. The user is decoded and
his roles are loaded to check his access rights. This step is carried out by
the [NPM acl package](https://www.npmjs.com/package/acl). Respective access
rights can and must be declared in the file
[`./graphql-server/acl_rules.js`](https://github.com/ScienceDb/graphql-server/blob/master/acl_rules.js).

You can run ScienceDb with or without this access control check. The default is
to run it _without_ checking access rights. 

To switch access right check on, you must uncomment the command line switch
`acl` and change the following line in
[`./graphql-server/migrateDbAndStartServer.sh`](https://github.com/ScienceDb/graphql-server/blob/master/migrateDbAndStartServer.sh)

```
npm start # acl
```
to
```
npm start acl
```

If you decide _not_ to use access control, we strongly recommend to restrict
access to the GraphiQL interface through the `graphql-server`. Switch off the
support for GraphiQL in [`./graphql-server/server.js`]():

```
// Excerpt from server.js

app.use('/graphql', cors(), graphqlHTTP((req) => ({
   schema: Schema,
   rootValue: resolvers,
   pretty: true,
   graphiql: false, // SWITCH OFF SUPPORT FOR GraphiQL by setting this to 'false'
   context: {
     request: req,
     acl: acl
   },
   formatError(error){
     return {
       message: error.message,
       details: error.originalError && error.originalError.errors ? error.originalError.errors : "",
       path: error.path
     };
   }
 })));
```


### Development environment

As long as you are developing your applications, you want the servers to react
to any changes you make to your code immediately. Hence, in the development
environment, the single-page-application is served through a dedicated server
and not compiled with `webpack` to be served statically. 

```
docker-compose -f docker-compose-dev.yml up --force-recreate --remove-orphans
```

### Production environment

Basically we now switch to production environment. The single-page-application
will be compiled with `webpack` and served statically with an `nginx` server.
The `graphql-server` will no longer be using the mounted local code but be
serving the code as present within the respective Docker image.

_Note_, that you may have to delete the graphql-server and/or nginx image and
rebuild them to have them using it your latest code!

#### Compile the single-page-application to be served statically
```
docker-compose -f docker-compose-dev.yml run --user 1000:1000 sdb_science_db_app_server bash
npm run build
```

#### Set the URL to the GraphQL-Server and your login-server

See the `environment` section of the `sdb_nginx` image in `docker-compose.yml`.

* `MY_SERVER_URL` - url where your backend server will be running, default value is http://localhost:3000/graphql
* `MY_LOGIN_URL` - url where your backend will check authentication, default value is http://localhost:3000/login.
* `MAX_UPLOAD_SIZE` - maximum size(in MB) of a file intended to be uploaded, default value is 500, which means that user can not upload a file larger than 500MB.

The above is taken from the [single-page-app `README`](https://github.com/ScienceDb/single-page-app/blob/master/README.md)

#### Build the Docker images

```
# Optionally remove 'old' images:
docker images | grep sciencedbstarterpack_ | awk '{print "docker rmi " $1}' | sh
# Build the images:
docker-compose -f docker-compose.yml build
```

#### Run the production stack

```
docker-compose -f docker-compose.yml up -d --force-recreate --remove-orphans
```

## Execute commands within a selected Docker container

Have a look at the following examples, please.

### Create a new Sequelize migration or seeder

If you want to generate a new Sequelize migration or seeder you need to do that
from within a Docker container created from the respective
`sdb_science_db_graphql_server` Docker image:
```
docker-compose -f docker-compose-dev.yml run --rm sdb_science_db_graphql_server bash
./node_modules/.bin/sequelize seed:generate --name my_new_seeder
```
_Note_ how we use `docker-compose-dev.yml` to have the local directory mounted
inside the Docker container, so that newly created files, like migrations or
seeder files, are actually persisted on the host file-system.

### Get an interactive SQL terminal to the relational database (POSTGRES)

```
docker-compose -f docker-compose.yml run --rm sdb_postgres psql -h sdb_postgres -U sciencedb -W sciencedb_development
```

### Get a command line interface to the Minio instance

There is a [Minio CLI documented in detail](https://docs.min.io/docs/minio-client-complete-guide). You can use it for example to upload local files into a designated bucket on the minio server.

You need the Docker image from minio. See above manual for installation details.

#### Start and use the Minio CLI

Assuming your local files are on your `Desktop`, launch the Minio container mounting you Desktop to opt.

```
docker run -v ~/Desktop:/opt --rm -it --entrypoint=/bin/sh minio/mc
```

Now register your Minio instance:
```
mc config host add my_minio http://my.sciencedb.org minioUser minioPw --api S3v4
```
The above `minioUser` and `minioPw` are set as environment variables in your docker-compose files. The URL depends on your server setup.

List all content on your Minio server
```
mc ls my_minio
```

List all commands
```
mc -h
```

Have fun!

## Stop the whole docker-compose

If you have started your docker-compose with `-d` or if you just want to delete the created containers, execute:
```
docker-compose -f docker-compose[-dev].yml down
```
The above `[-dev]` has to be user or not, depending on whether you ran the development or production environment.

### Abolish everything

To remove the docker images execute (see above):
```
docker images | grep sciencedbstarterpack_ | awk '{print "docker rmi " $1}' | sh
```

To delete the volumes _permanently_ in which your data has been stored execute:
```
docker volume ls | grep sciencedbstarterpack | awk '{print "docker volume rm " $2}' | sh
```
Be _warned_: All your data will be lost!

