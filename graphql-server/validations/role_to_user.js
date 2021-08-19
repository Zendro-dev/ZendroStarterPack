// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(role_to_user) {

    role_to_user.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    role_to_user.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "userId": {
                "type": ["integer", "null"]
            },
            "roleId": {
                "type": ["integer", "null"]
            }
        }
    }

    role_to_user.prototype.asyncValidate = ajv.compile(
        role_to_user.prototype.validatorSchema
    )

    role_to_user.prototype.validateForCreate = async function(record) {
        return await role_to_user.prototype.asyncValidate(record)
    }

    role_to_user.prototype.validateForUpdate = async function(record) {
        return await role_to_user.prototype.asyncValidate(record)
    }

    role_to_user.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    role_to_user.prototype.validateAfterRead = async function(record) {
        return await role_to_user.prototype.asyncValidate(record)
    }

    return role_to_user
}