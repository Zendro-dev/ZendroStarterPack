# dotfiles

This project holds a Docker container setup used as development environment, and also as a source for production / deployment environment. It enables distributed developer of "ScienceDb" to have a well defined environment.

A presentation of ScienceDb can be found [here](https://github.com/ScienceDb/dotfiles/blob/master/ScienceDb.pdf).

## Structure

Science Db is a collection of four NodeJS projects providing an easy to setup, extend, and maintain knowledge management system for science. It is greatly influenced by e.g. [RailsAdmin](https://github.com/sferik/rails_admin) or [Django](https://www.djangoproject.com/). It follows the philosophy of code generation to define and migrate data models. Access to these is provided through a backend in the form of [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) web services, and an _optional_ Graphical User Interface (GUI) in the form of a single page web application (SPA). Both interfaces provide the standard Create, Read, Update, and Delete ([CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)) use cases.

### Philosphy / Frameworks

The project was inspired by [this](http://mherman.org/blog/2015/10/22/node-postgres-sequelize/#.WZ_Iq9hCRaR) blog post. We use the renowned Model-View-Controller ([MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)) architecture.

#### Backend

We use [Express](https://expressjs.com/) and [Sequelize](http://docs.sequelizejs.com/) for the backend.

#### Frontend

We use [VueJS v2](https://vuejs.org/) for the frontend.

### Sub-Projects

There are two skeleton projects and two code generator projects forming ScienceDb.

#### ScienceDbBackend

A default Backend providing User, Roles, Authentication and Authorization, _optional_ support for multipe [relational databases](https://en.wikipedia.org/wiki/Relational_database), and a [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) is [ScienceDbBackend](https://github.com/ScienceDb/ScienceDbBackend).

#### ScienceDbBackend code generators

##### Model and Migration 

Model and migration files are created using Sequelize command line interface. For example to create a new model `plant` use 

````
sequelize model:create --name Plant --attributes 'title:string, taxon:string, gmo:boolean'

````

##### Controller

To generate controller files, use our code generator project [express_route_gen_js](https://github.com/ScienceDb/express_route_gen_js)

#### Frontend

A skeleton frontend single page web application (SPA) using [VueJs v2](https://vuejs.org/) and [vuetable-2](https://github.com/ratiw/vuetable-2) is provided as [ScienceDbGui](https://github.com/ScienceDb/ScienceDbGui). 

To add the GUI for a new data model use the [frontend code generator](https://github.com/ScienceDb/admin_gui_gen).

#### ScienceDb Frontend Code generator

The [frontend code generator admin_gui_gen](https://github.com/ScienceDb/admin_gui_gen) is a subproject of ScienceDb. For example to generate the GUI components for a new data model `plant` issue
````
admin_gui_gen --baseUrl 'www.scienceDb.org' --name Plant --attributes 'title:string, taxon:string, gmo:boolean'
````
_Note_, that the `baseUrl` points to your backend server.

## Developmental work cycle

The basic idea is to build the development [Docker](https://www.docker.com/)-Image, start it as a [daemon](https://en.wikipedia.org/wiki/Daemon_(computing)), and connect to it using [SSH](https://en.wikipedia.org/wiki/Secure_Shell). Within the Docker image the four above sub-projects are already checked out [(git)](https://git-scm.com/) and can be started.

This usage of a development docker container enables distributed programmers to share a unified well defined development platform.

## Installation / Developmental Usage

### Setup the Developmental Docker Images

 1. Download the shell script [initUserDb.sh](https://github.com/ScienceDb/dotfiles/blob/master/initUserDb.sh), docker-compose file [docker-compose.yml](https://github.com/ScienceDb/dotfiles/blob/master/docker-compose.yml), Dockerfiles [debian_science_db.txt](https://github.com/ScienceDb/dotfiles/blob/master/debian_science_db.txt) and [postgres_db.txt](https://github.com/ScienceDb/dotfiles/blob/master/postgres_db.txt)  
 2. Open the folder with files downloaded in the Terminal/Cmd;
 _Note_ In order to have the possibility to edit the code within the projects you can download/save projects in the folder where all previous files were downloaded
 3. start up your application by running:
 ````
  docker-compose up
 ````

#### SSH into the development container
 Enable SSH connection to the docker container (use `poiuyt098` as a password for SSH connection):
````
 ssh root@localhost -p 2939
````

 _Notes_ for Windows users: 
   * you can use any windows app that provides the possibility to make a ssh connection to the server;
   * [Linux Bash Shell](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/);
   * or [cygwin](https://www.cygwin.com/) ).

#### Setup projects
 Checkout projects with git and run initial setup. Within the above SSH session, execute

````
 sh /root/setup_projects
````

### Start the ScienceDb Backend
 Open ~/projects/ScienceDbBackend using SSH session and run:
````
 PORT=3000 npm start
````
_Note_, that `3000` is an arbitrary port. You can specify a different one, but in that case need to adjust the frontend...


### Run the ScienceDb Frontend (SPA GUI) 
 Open ~/projects/ScienceDbGui and run:
````
 PORT=3333 npm run dev
````
