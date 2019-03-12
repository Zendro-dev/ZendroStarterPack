# ScienceDBStarterPack

//To be strongly edited

ScienceDB can be used for different projects where it is desirable to open access to to vaious databases . 
Each projects can have have it's own data sets, project specific code, etc. However, 
all these projects are based on the same package: ScienceDBStarterPack.

As long as project specific data is also stored on the GitHub, it was decided at least for now, 
to keep this data within different branches of the ScienceDBStarterPack project.    

To install your project, that is stored within `YOUR_BRANCH` branch, use the command below: 

```
git clone --recursive -b YOUR_BRANCH https://github.com/ScienceDb/ScienceDbStarterPack.git
```

After this command, all submodules will be initialized and updated automatically (updated to the current 
versions in their repositories??? - check this).


To create a new project based on this package please run the script:
```
./scripts/install.sh
```

You can run this project in development or in production modes. Just add 
a full path `docker-compose.yml` symlink to the corresponding `*_dev.yml` or `*_srv.yml` file.
This way you can use `docker-compose` command without `-f` option.

```
ln -s `pwd`/docker_compose_dev.yml docker-compose.yml
```


To checkout submodules content manually, use:
```
git submodule update --recursive
```

*****
TODO: What about project-specific installations? How to make it more generic?
Which rules to adjust? 
