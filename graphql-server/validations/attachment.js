// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(attachment) {

    attachment.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    attachment.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "fileName": {
                "type": ["string", "null"]
            },
            "fileURL": {
                "type": ["string", "null"]
            },
            "mimeType": {
                "type": ["string", "null"]
            },
            "fileSize": {
                "type": ["integer", "null"]
            },
            "identifierName": {
                "type": ["string", "null"]
            }
        }
    }

    attachment.prototype.asyncValidate = ajv.compile(
        attachment.prototype.validatorSchema
    )

    attachment.prototype.validateForCreate = async function(record) {
        return await attachment.prototype.asyncValidate(record)
    }

    attachment.prototype.validateForUpdate = async function(record) {
        return await attachment.prototype.asyncValidate(record)
    }

    attachment.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    attachment.prototype.validateAfterRead = async function(record) {
        return await attachment.prototype.asyncValidate(record)
    }

    return attachment
}