const path = require('path');

const { buildSchema } = require('graphql');
const mergeSchema = require(path.join(__dirname,'../','utils','merge-schemas'));

module.exports.schema = buildSchema(mergeSchema(path.join(__dirname,'../','./schemas')));

/**
 * Each model deefined in it's *.json file can have a description field. However, we also add
 * internal annotations within this filed. It is possible to search for fields of the given
 * model with respect to the presence of an annotation inside of it's description.
 * @function getModelFieldByAnnotation
 * @param {string} model_name - The name of the data model to be explored.
 * @param {string} annotation - An annotation name, for example "@original-field"
 * @return {Array}            - an array of model field names that contain a given annotation in it's
 *                              description
 */
module.exports.getModelFieldByAnnotation = function(model_name, annotation){
    let schema = module.exports.schema;

    let model_type = schema.getType(model_name);
    if(! schema.getType(model_name))
        throw new Error(`Model ${model_name} not exist`);

    let fields = model_type._fields;

    return Object.keys(fields).filter( a => {
        let desc = fields[a].description;
        if(desc)
            return desc.toString().includes(annotation);
        return false;
    })
};