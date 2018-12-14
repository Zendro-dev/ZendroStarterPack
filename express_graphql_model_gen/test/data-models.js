module.exports.transcript_count = {
  "model" : "transcript_count",
  "storageType" : "SQL",
  "attributes" : {
    "gene" : "String",
    "variable" : "String",
    "count" : "Float",
    "tissue_or_condition": "String"
  },
  "associations":{
    "individual":{
      "type" : "sql_belongsTo",
      "target" : "individual",
      "targetKey" : "individual_id",
      "targetStorageType" : "sql"
    }
  }
}

module.exports.individual = {
  "model" : "individual",
  "storageType" : "SQL",
  "attributes" : {
    "name" : "String"
  },
  "associations": {
    "transcript_counts": {
      "type" : "sql_hasMany",
      "target" : "transcript_count",
      "targetKey" : "individual_id",
      "targetStorageType" : "sql"
    }
  }
}

module.exports.individual_no_assoc = {
  "model" : "individual",
  "storageType" : "SQL",
  "attributes" : {
    "name" : "String"
  }
}

module.exports.transcript_count_no_assoc =  {
  "model" : "transcript_count",
  "storageType" : "SQL",
  "attributes" : {
    "gene" : "String",
    "variable" : "String",
    "count" : "Float",
    "tissue_or_condition": "String"
  }
}

module.exports.person = {
  "model" : "Person",
  "storageType" : "SQL",
  "attributes" : {
    "firstName" : "String",
    "lastName" : "String",
    "email" : "String"
  },
  "associations":{
    "dogs":{
      "type" : "sql_hasMany",
      "target" : "Dog",
      "targetKey" : "personId",
      "targetStorageType" : "sql"
    },

    "books":{
      "type" : "sql_belongsToMany",
      "target" : "Book",
      "targetKey" : "bookId",
      "sourceKey" : "personId",
      "keysIn" : "books_to_people",
      "targetStorageType" : "sql"
    }
  }
}

module.exports.book = {
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
          "targetKey" : "personId",
          "sourceKey" : "bookId",
          "keysIn" : "books_to_people",
          "targetStorageType" : "sql"
        },
      "publisher" : {
        "type" : "cross_belongsTo",
        "target" : "Publisher",
        "targetKey" : "publisherId",
        "targetStorageType" : "webservice"
        }
  }
}

module.exports.researcher = {
  "model" : "Researcher",
  "storageType" : "SQL",
  "attributes" : {
    "firstName" : "String",
    "lastName" : "String",
    "email" : "String"
  },
  "associations":{
    "projects":{
      "type" : "sql_belongsToMany",
      "target" : "Project",
      "targetKey" : "projectId",
      "sourceKey" : "researcherId",
      "keysIn" : "project_to_researcher",
      "targetStorageType" : "sql"
    },
    "dog":{
      "type": "sql_hasOne",
      "target": "Dog",
      "targetKey": "researcherId",
      "targetStorageType": "sql"
    }
  }
}

module.exports.specie = {
  "model" : "Specie",
  "storageType" : "webservice",
  "attributes" : {
    "nombre" : "String",
    "e_nombre_comun_principal" : "String",
    "e_foto_principal" : "String",
    "nombre_cientifico" : "String"
  },

  "associations":{
    "projects" : {
      "type" : "cross_hasMany",
      "target" : "Project",
      "targetKey" : "specieId",
      "targetStorageType" : "sql"
    }
  }
}

module.exports.dog = {
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
      "targetStorageType" : "sql",
      "label": "firstName",
      "sublabel": "lastName"
    },
    "researcher":{
      "type" : "sql_belongsTo",
      "target": "Researcher",
      "targetKey": "researcherId",
      "targetStorageType": "SQL",
      "label": "firstName"
    }
  }
}
