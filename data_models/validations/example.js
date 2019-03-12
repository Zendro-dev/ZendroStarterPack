// Delete this file, if you do not want or need any validations.
const Joi = require('joi');

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(example) {

    example.prototype.validatorSchema = Joi.object().keys({
        name: Joi.string().alphanum()
    }).options({
        allowUnknown: true
    });

    example.prototype.validatorForCreate = function(record) {

        return Joi.validate(record, example.prototype.validatorSchema);

    };

    example.prototype.validatorForUpdate = function(record) {

        return Joi.validate(record, example.prototype.validatorSchema);

    };

    example.prototype.validatorForDelete = function(model) {

        //TODO: on the input you have the model to be deleted, no generic Joi checks are available

        return {
            error: null
        };

    };

    return example;
};