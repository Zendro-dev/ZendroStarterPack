# Code-generator

Command line utility to auto-generate the structure files that [this server](https://github.com/ScienceDb/server-graphql-sequelize)
will use to perform CRUD operations for each model created.

## Set up:
Clone the repository and run:
```
$ npm install
```

## Usage:

To run the test case:
```
$ npm test
```

And to generate the structure files:
```
$ npm start generate <input-json-files> <output-directory>
```
```
INPUT:
<input-json-files> - directory where json models are stored
<output-directory> - directory where the generated code will be written
```
This command will create(if doesn't exist) four folders containing the generated files for each model in the ```input-json-files```:

* models ----> sequelize model
* schemas ----> graphQL schema
* resolvers ----> basic CRUD resolvers 
* migrations ----> create and delete table migration file


## Example of use:
In the same directory of this repository run:

```
$ npm start generate ./example_json_files /your_path_directory
```
If you want to complete the example with the [server](https://github.com/ScienceDb/server-graphql-sequelize)
make ```/your_path_directory``` the same directory where the server repository is stored.

NOTE: For displaying the explanation about usage we can run the help flag:
```
$ npm start -- -h
```

## JSON files Spec

Each json file describes one and only one model. (i.e if an association involves two models, this association needs to be specified in both json files, corresponding to each model).

For each model we need to specify the following fields in the json file:

Name | Type | Description
------- | ------- | --------------
*name* | String | Name of the model (it is recommended uppercase for the initial character).
*storageType* | String | Type of storage where the model is stored. So far can be one of __sql__ or __Webservice__
*attributes* | Object | The key of each entry is the name of the attribute and the value should be the a string indicating the type of the attribute. See [table](types-spec) below for allowed types. Example: ```{ "attribute1" : "String", "attribute2: "Int" }```
*associations* | Object | The key of each entry is the name of the association and the value should be an object describing the associations. See [Associations Spec](associations-spec) section below for the specifications of the associations. 

EXAMPLES OF VALID JSON FILES

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
      "targetStorageType" : "sql"
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
          "targetStorageType" : "sql"
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
 
When the association is of the type 4, it's necessary to describe a couple of two extra arguments given that the association is made with a cross table. The extra two arguments will be:

name | Type | Description
------- | ------- | --------------
*sourceKey* | String | Key to identify the source id
*keysIn* | String | Name of the cross table

Example:
```
{
 "model" : "Book",
 "storageType" : "SQL",
 "attributes" : {
        "id" : Int,
        "title": String,
        "ISBN": Int
    },
 "associations" : {
        "authors" : {
            "type" : "sql_belongsToMany",
            "target" : "Person",
            "targetKey" : "person_id",
            "sourceKey" : "book_id",
            "keysIn" : "person_to_book"
        }
    }
}
```

