# ScienceDBStarterPack

ScienceDB can be used for different collecting data projects. 
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
