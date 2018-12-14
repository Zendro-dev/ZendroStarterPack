# admin_gui_gen

Code generator for VueJs implementing basic CRUD use cases.

## Usage

From the command line prompt

````
 admin_gui_gen -h

  Usage: admin_gui_gen [options] <directory>
  
  <directory> path where GUI components will be rendered

  Options:

    --jsonFiles <files-directory>      Directory containing one json file for each model.
    -h, --help                         Output usage information
````
`<directory>` should contain a skeleton of the GUI, for download the skeleton and more details in how to run the GUI see [THIS](https://github.com/ScienceDb/ScienceDbGui/tree/enciclovida).

## JSON files Spec

Each json file describes one and only one model. (i.e if an association involves two models, this association needs to be specified in both json files, corresponding to each model).

For each model we need to specify the following fields in the json file:

Name | Type | Description
------- | ------- | --------------
*name* | String | Name of the model (it is recommended uppercase for the initial character).
*storageType* | String | Type of storage where the model is stored. So far can be one of __sql__ or __Webservice__
*attributes* | Object | The key of each entry is the name of the attribute and the value should be the a string indicating the type of the attribute. See [table](types-spec) below for allowed types. Example: ```{ "attribute1" : "String", "attribute2: "Int" }```
*associations* | Object | The key of each entry is the name of the association and the value should be an object describing the associations. See [Associations Spec](associations-spec) section below for the specifications of the associations. 

EXAMPLES OF VALIDS JSON FILES

```
//Dog.json
{
  "model" : "Dog",
  "storageType" : "Sql",
  "attributes" : {
    "name" : "String",
    "breed" : "String"
  },

  "associations" : {
    "person" : {
      "type" : "sql_belongsTo",
      "target" : "Person",
      "targetKey" : "personId",
      "label": "firstName"
    }
  }
}

```

```
//Publisher.json
{
  "model" : "Publisher",
  "storageType" : "webservice",
  "attributes" : {
    "name" : "String",
    "phone" : "String"
  },
  "associations":{
      "books" : {
          "type" : "cross_hasMany",
          "target" : "Book",
          "targetKey" : "publisherId",
          "label": "title",
          "sublabel": "genre"
        }
  }
}

```



### Types Spec
The following types are allowed for the attributes field

 Type | 
------- | 
String |
Int |
Float |
Boolean |



### Associations Spec

We will consider six possible type of associations depending on the Storage:
1. sql_belongsTo
2. sql_hasOne
3. sql_hasMany
4. sql_belongsToMany
5. cross_hasOne
6. cross_hasMany

First four type of associations explain them selves and they are intended to be used when both, source and target models, are stored in SQL databases.
Last two type of associations are intended to be used when at least one of the models involved is stored in a WebService. 

For all type of association, except for association  of type 4 (sql_belongsToMany), the necessary arguments would be:

name | Type | Description
------- | ------- | --------------
*type* | String | Type of association (one of the six described above).
*target* | String | Name of model to which the current model will be associated with
*targetKey* | String | Key to identify the field in the target
*label* | String | Name of the column in the target model to be used as a display name
*sublabel* | String | Optional name of the column in the target model to be used as a sub-label
  
  
When the association is of the type 4, it will be enough describing `type` `target`, `label` and `sublabel`(optional)

Example:
```
{
  "model" : "Book",
  "storageType" : "sql",
  "attributes" : {
    "title" : "String",
    "genre" : "String"
  },
  "associations":{

      "people" : {
          "type" : "sql_belongsToMany",
          "target" : "Person",
          "label" : "firstName",
          "sublabel" : "email"
        },
      "publisher" : {
        "type" : "cross_belongsTo",
        "target" : "Publisher",
        "targetKey" : "publisherId",
        "label" : "name"
        }
  }
}
```
