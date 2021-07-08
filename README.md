# ScienceDBStarterPack

This is a collection of skeleton projects and code generators used to get a new
user started with Zendro. To get you started minimal configuration is needed.  
Be aware that this StarterPack provides a minimal working example using a single postgres database. To run Zendro in a real production environment and support other storageTypes more configuration is needed.


## Prerequisites

You should have basic knowledge of the following technology-stack:
* [`Node.js`](https://nodejs.dev/)
* [`GraphQL`](https://graphql.org/)
* [`REACT.js`](https://reactjs.org/)
* [`docker`](https://www.docker.com/)
* [`git`](https://git-scm.com/)
* [`Linux Shell`](https://en.wikipedia.org/wiki/Bash_(Unix_shell))

_Note_, that this project is meant to be used on a `*nix` system, preferably
Linux.

## Install and setup skeleton projects

First you need to `git clone` this project into a local directory on your host
system:
```
git clone https://github.com/ScienceDb/ScienceDbStarterPack.git
```

The skeleton [GraphQL server](https://github.com/ScienceDb/graphql-server) and the 
skeleton [single page application server](https://github.com/ScienceDb/single-page-app) projects are managed as different git repositories.
"Skeleton" means that these projects provide all the code needed
to start a server, but actually have no code particular to any
data model.

### Setup the skeleton projects
To download the skeleton projects as well as a zendro specific version of [graphiql](https://github.com/Zendro-dev/graphiql-auth) you can run
```
yarn setup
# -g: graphql-server branch | default: master
# -s: single-page-app branch |  default: develop
# -i: graphiql-auth branch | default: master
```
This will add the desired versions of the skeleton projects to the directory. You should now have three folders `graphql-server`, `single-page-app` and `graphiql-auth` in your StarterPack root directory.  

## Install the graphql code generator within a dedicated Docker image

To avoid having to install the Zendro graphql-server code-generator on your host system we
provide a dedicated Docker image in which two code generators are installed and
ready to be used. Run

```
yarn codegen:build
```

## Define your data models

Within the directory `./data_model_definitions` you can place your data model
definitions in respective `JSON` files. To learn more about how to define data
models with Zendro please see our [manual and
documentation](https://sciencedb.github.io/).

### Use default user and roles

We strongly recommend using the default data models `user.json` and
`role.json`. This gives you a ready to login and secure set of servers.

If you choose to follow the recommendation, you should edit the Sequelize
seeder `./seeders/20190225162439-create_roles_n_users.js` to create your
default admin-user and default roles.

If modified it is _most important_ that you then copy the seeder into the graphql-server
code dir:
```
cp -r ./seeders ./graphql-server
```

### Generate the graphql-server code

Using the dedicated Docker image in which the code generators are installed you
can invoke them on the data model definitions you placed in the
`data_model_definitions` directory.

```
yarn codegen:run
graphql-server-model-codegen -m -f /opt/data_model_definitions -o /opt/graphql-server
```

Whenever you make changes to your data model definitions you should rerun the above command.

#### Generate the Single Page Application (SPA) server
The SPA will automatically read from your data_model_definitions folder and generate the needed code. See SPA [README](https://github.com/Zendro-dev/single-page-app/blob/develop/README.md) for more information.

### Multiple code generation

Be very carefull when running the code generators multiple times on the same data model definitions. Two nasty things can happen:

1. You might overwrite manual changes you might have made to come of the code that was automatically generated.
2. In the case of relational databases, Zendro code generators also create migrations (using Sequelize). As these are named using the current date, you might have several migrations to create the same tables. This will lead to errors. Make sure you delete the migrations folder content, if you want to run the code generators multiple times on the same model definitions: `rm ./graphql-server/migrations/*` or run the codegen without the `-m` flag. 

## Start the servers

Upon starting the servers in any mode development or production any pending
database migrations and seeding is automatically triggered. See file
`./graphql-server/migrateDbAndStartServer.sh`, and the two docker-compose files
`docker-compose-dev.yml` (development) and `docker-compose-prod.yml` (production).

### Configuration

#### Graphql Server
To configure the graphql-server create a `.env` inside the `graphql-server` folder (recommended) or set the variables via the docker-compose files.

It is mandatory to set the `ALLOW_ORIGIN` and `JWT_SECRET` environment variables depending on the users needs. For example
* `ALLOW_ORIGIN="*"`
* `JWT_SECRET="my secret"`  

`ALLOW_ORIGIN` sets the `Access-Control-Allow-Origin` header and `JWT_SECRET` is needed to define a secret for decoding the Bearer token.

If you want to access the GraphiQL interface (`http://localhost:3000/graphql`) without a authorization token, toggle the associated environment variable:
```
REQUIRE_SIGN_IN="false"
```
in the docker-compose file.
For more details about the graphql-server environment variables see the [graphql-server `README`](https://github.com/ScienceDb/graphql-server/blob/master/README.md)
#### Single Page App
The single page application has to be aware of the URLs to use for login and to send GraphQL queries to. This is controlled by the following environment variables.

* `NEXT_PUBLIC_ZENDRO_GRAPHQL_URL='http://localhost:3000/graphql'`
* `NEXT_PUBLIC_ZENDRO_LOGIN_URL='http://localhost:3000/login'`
* `NEXT_PUBLIC_ZENDRO_EXPORT_URL='http://localhost:3000/export'`
* `NEXT_PUBLIC_ZENDRO_METAQUERY_URL='http://localhost:3000/meta_query'`
* `NEXT_PUBLIC_ZENDRO_MAX_UPLOAD_SIZE=500`
* `NEXT_PUBLIC_ZENDRO_MAX_RECORD_LIMIT=10000`
* `ZENDRO_DATA_MODELS='./data_model_definitions'`

The recommended way is to create a `.env.development` and `.env.production` inside the `single-page-app` folder for your environment variables.`
**Note** that in case you are running the SPA via a docker container the `ZENDRO_DATA_MODELS` path has to reflect the location inside the container. If you are using the default dev|prod docker-compose files the folder will be mounted inside `single-page-app`.

For more details see our [manual](https://sciencedb.github.io/) and the
[single-page-application`README`](https://github.com/ScienceDb/single-page-app/blob/develop/README.md).

#### Access Control

Zendro can be used checking access rights for every single GraphQL query
received by the currently logged in user identified by the respective [JSON Web
Token](https://jwt.io/) found in the request header. The user is decoded and
his roles are loaded to check his access rights. This step is carried out by
the [NPM acl package](https://www.npmjs.com/package/acl). Respective access
rights can and must be declared in the file
[`./graphql-server/acl_rules.js`](https://github.com/ScienceDb/graphql-server/blob/master/acl_rules.js).

You can run Zendro with or without this access control check. The default is
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
yarn dev
```

### Production environment

Basically we now switch to production environment. The single-page-application
will be compiled with `webpack` and served statically.

```
yarn start
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

Create a bucket
```
mc mb my_minio/my_bucket
```

Copy files to bucket
```
mc cp opt/my_file1 my_minio/my_bucket
mc cp opt/my_file2 my_minio/my_bucket
```

Have fun!

## Stop the whole docker-compose

If you have started your docker-compose with `-d` or if you just want to delete the created containers, execute:
```
yarn stop dev|prod
```
The above `[-dev]` has to be used or not, depending on whether you ran the development or production environment.

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

If you also want to delete the Docker image holding the code generators execute:
```
docker rmi sciencedb-code-generators:latest
```

#### Start from scratch

If you want to start from scratch, and generate the code for your model definitions again, we recommend to remove your local copies of `graphql-server` and `single-page-application` and check these sub-modules out again using git.

## Contributions
Zendro is the product of a joint effort between the Forschungszentrum Jülich, Germany and the Comisión Nacional para el Conocimiento y Uso de la Biodiversidad, México, to generate a tool that allows efficiently building data warehouses capable of dealing with diverse data generated by different research groups in the context of the FAIR principles and multidisciplinary projects. The name Zendro comes from the words Zenzontle and Drossel, which are Mexican and German words denoting a mockingbird, a bird capable of “talking” different languages, similar to how Zendro can connect your data warehouse from any programming language or data analysis pipeline.

### Zendro contributors in alphabetical order
Francisca Acevedo<sup>1</sup>, Vicente Arriaga<sup>1</sup>, Katja Dohm<sup>3</sup>, Constantin Eiteneuer<sup>2</sup>, Sven Fahrner<sup>2</sup>, Frank Fischer<sup>4</sup>, Asis Hallab<sup>2</sup>, Alicia Mastretta-Yanes<sup>1</sup>, Roland Pieruschka<sup>2</sup>, Alejandro Ponce<sup>1</sup>, Yaxal Ponce<sup>2</sup>, Francisco Ramírez<sup>1</sup>, Irene Ramos<sup>1</sup>, Bernardo Terroba<sup>1</sup>, Tim Rehberg<sup>3</sup>, Verónica Suaste<sup>1</sup>, Björn Usadel<sup>2</sup>, David Velasco<sup>2</sup>, Thomas Voecking<sup>3</sup>

#### Author affiliations
1. CONABIO - Comisión Nacional para el Conocimiento y Uso de la Biodiversidad, México
2. Forschungszentrum Jülich - Germany
3. auticon - www.auticon.com
4. InterTech - www.intertech.de

### Zendro author contributions
Asis Hallab and Alicia Mastretta-Yanes coordinated the project. Asis Hallab designed the software. Programming of code generators, the browser based single page application interface, and the GraphQL application programming interface was done by Katja Dohm, Constantin Eiteneuer, Francisco Ramírez, Tim Rehberg, Veronica Suaste, David Velasco, Thomas Voecking, and Dan Wang. Counselling and use case definitions were contributed by Francisca Acevedo, Vicente Arriaga, Frank Fischer, Roland Pieruschka, Alejandro Ponce, Irene Ramos, and Björn Usadel. User experience and application of Zendro on data management projects was carried out by Asis Hallab, Alicia Mastretta-Yanes, Yaxal Ponce, Irene Ramos, Verónica Suaste, and David Velasco. Logo design was made by Bernardo Terroba.
