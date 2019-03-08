#Docker

ScienceDB servers and submodules are running within docker-compose containers. 
Each container have it’s own internal environment and project-specific configurations. 
Here you can find a per-container folders that contain a corresponding `Dockerfile` 
(if necesarry) and all the other data required to run container.

It is assumed that some configurations are project specific, such as `config.json` or 
`globals.js` files under the `graphql` folder. Therefore, it is here the place where you 
can modify these files and store them within the project branch at GitHub.

Therefore, none of the project-specific or container-specific configurations are not 
distributed within submodule projects referred in the `../.gitmodules` file.

The context of each container is the ScienceDbStarterPack root folder, so that any 
`Dockerfile` route is relative to the root folder of the ScienceDBStarterPack project.

*****

All `.sh` scripts present here are to be copied to /etc/init.d/ folder of each
corresponding container, so each script has to start it's server automatically. 
(questionable)