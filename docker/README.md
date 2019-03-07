As long as each submodule project can have it's own standalone configuration,
we do not distribute `Dockerfile` or any other configurations specific for
ScienceDbStarterPack within submodule projects, so these are completely independent 
from this StarterPack distribution.

Some containers need additional setup while running. Here we store all files 
that are required by corresponding docker images, startup scripts, default 
configuration files, etc.

Each image has it's own sub-folder here, so that image-specific files are
isolated one from the other, and all are collected in the same place.

The context of each container is the ScienceDbStarterPack root folder,
so that all `Dockerfile` routes are relative to that folder.

*****

All `.sh` scripts present here are to be copied to /etc/init.d/ folder of each
corresponding container, so each script has to start it's server automatically.

No image specific `command: ...` options are present in docker_compose.yml. 
However, some commands can be used for debugging purposes, for example:
```
command:
    - top > /dev/null ...
```

These are particularly useful when server fails to start within it's container (maybe). 