// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(role) {

    role.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    role.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            }
        }
    }

    role.prototype.asyncValidate = ajv.compile(
        role.prototype.validatorSchema
    )

    role.prototype.validateForCreate = async function(record) {
        return await role.prototype.asyncValidate(record)
    }

    role.prototype.validateForUpdate = async function(record) {
        return await role.prototype.asyncValidate(record)
    }

    role.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    role.prototype.validateAfterRead = async function(record) {
        return await role.prototype.asyncValidate(record)
    }

    return role
}