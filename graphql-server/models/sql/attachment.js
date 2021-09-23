'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');
const dict = require('../../utils/graphql-sequelize-types');
const searchArg = require('../../utils/search-argument');
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
const fileTools = require('../../utils/file-tools');
const helpersAcl = require('../../utils/helpers-acl');
const email = require('../../utils/email');
const fs = require('fs');
const path = require('path');
const os = require('os');
const uuidv4 = require('uuidv4').uuid;
const isImagePackage = require('is-image');
const helper = require('../../utils/helper');
const models = require(path.join(__dirname, '..', 'index.js'));
const moment = require('moment');
const errorHelper = require('../../utils/errors');
const minioClient = require('../../utils/minio-connection');
// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'attachment',
    storageType: 'sql',
    attributes: {
        id: 'String',
        fileName: 'String',
        fileURL: 'String',
        mimeType: 'String',
        fileSize: 'Int',
        identifierName: 'String',
        book_id: 'String'
    },
    associations: {
        book: {
            type: 'many_to_one',
            implementation: 'foreignkeys',
            reverseAssociation: 'attachments',
            target: 'book',
            targetKey: 'book_id',
            keysIn: 'attachment',
            targetStorageType: 'sql'
        }
    },
    internalId: 'id',
    id: {
        name: 'id',
        type: 'String'
    }
};
const DataLoader = require("dataloader");

const URL_IMG_PROXY = "http://localhost:8082/"
const IMG_BUCKET_NAME = "images";
const FILES_BUCKET_NAME = "test";
/**
 * module - Creates a sequelize model
 *
 * @param  {object} sequelize Sequelize instance.
 * @param  {object} DataTypes Allowed sequelize data types.
 * @return {object}           Sequelize model with associations defined
 */

module.exports = class attachment extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            fileName: {
                type: Sequelize[dict['String']]
            },
            fileURL: {
                type: Sequelize[dict['String']]
            },
            mimeType: {
                type: Sequelize[dict['String']]
            },
            fileSize: {
                type: Sequelize[dict['Int']]
            },
            identifierName: {
                type: Sequelize[dict['String']]
            },
            book_id: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "attachment",
            tableName: "attachments",
            sequelize
        });
    }

    /**
     * Get the storage handler, which is a static property of the data model class.
     * @returns sequelize.
     */
    get storageHandler() {
        return this.sequelize;
    }

    /**
     * Cast array to JSON string for the storage.
     * @param  {object} record  Original data record.
     * @return {object}         Record with JSON string if necessary.
     */
    static preWriteCast(record) {
        for (let attr in definition.attributes) {
            let type = definition.attributes[attr].replace(/\s+/g, '');
            if (type[0] === '[' && record[attr] !== undefined && record[attr] !== null) {
                record[attr] = JSON.stringify(record[attr]);
            }
        }
        return record;
    }

    /**
     * Cast JSON string to array for the validation.
     * @param  {object} record  Record with JSON string if necessary.
     * @return {object}         Parsed data record.
     */
    static postReadCast(record) {
        for (let attr in definition.attributes) {
            let type = definition.attributes[attr].replace(/\s+/g, '');
            if (type[0] === '[' && record[attr] !== undefined && record[attr] !== null) {
                record[attr] = JSON.parse(record[attr]);
            }
        }
        return record;
    }

    static associate(models) {
        attachment.belongsTo(models.book, {
            as: 'book',
            foreignKey: 'book_id'
        });
    }

    /**
     * Batch function for readById method.
     * @param  {array} keys  keys from readById method
     * @return {array}       searched results
     */
    static async batchReadById(keys) {
        let queryArg = {
            operator: "in",
            field: attachment.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await attachment.readAllCursor(queryArg);
        cursorRes = cursorRes.attachments.reduce(
            (map, obj) => ((map[obj[attachment.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(attachment.batchReadById, {
        cache: false,
    });

    static async readById(id) {
        return await attachment.readByIdLoader.load(id);
    }
    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, attachment.definition.attributes);
        return super.count(options);
    }

    static async uploadAttachment(input){

        if(input.file){
            console.log("FILE: ", input.file);
            const {filename, mimetype, createReadStream} =  await input.file.file;
            const stream = createReadStream();
            input['fileName'] = input.fileName ?? filename;
            const bucket_name = isImagePackage(input.fileName) ?  IMG_BUCKET_NAME : FILES_BUCKET_NAME;
            const exists = await minioClient.fileExists(input.fileName, bucket_name);
            console.log("EXISTS: ", exists);
            if( !exists) {
                const upload = await minioClient.uploadFile(stream, input.fileName, bucket_name);
                if(! upload.success){
                    throw upload.error;
                }
                input['mimeType'] = mimetype;
                input['fileURL'] = upload.url;
                input['fileSize'] = upload.fileSize;
            }else{
                throw new Error(`File with name ${input.fileName} already exists.`)
            }

        }
        return await this.addOne(input);
    }

    urlThumbnail({width, height, format}){
        if(this.isImage() ){
            let url = `${URL_IMG_PROXY}unsafe/fit/${width}/${height}/sm/0/plain/s3://images/${this.fileName}@${format}`;
            return url;
        }
        return "This file attachment is not an image";
    }

    isImage(){
        return isImagePackage(this.fileName);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), attachment.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => attachment.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), attachment.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => attachment.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), attachment.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            attachments: edges.map((edge) => edge.node)
        };
    }

    static async addOne(input) {
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);
        input = attachment.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            attachment.postReadCast(result.dataValues)
            attachment.postReadCast(result._previousDataValues)
            return result;
        } catch (error) {
            throw error;
        }

    }

    static async deleteAttachment(id){
        let attachment = await super.findByPk(id);
        if (attachment === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        const bucket_name = isImagePackage(attachment.fileName) ?  IMG_BUCKET_NAME : FILES_BUCKET_NAME;
        let deleted = await minioClient.deleteFile(attachment.fileName, bucket_name);
        if(!deleted.success){
          throw deleted.error;
        }
        return  this.deleteOne(id);
    }

    static async deleteOne(id) {
        //validate id
        await validatorUtil.validateData('validateForDelete', this, id);
        let destroyed = await super.destroy({
            where: {
                [this.idAttribute()]: id
            }
        });
        if (destroyed !== 0) {
            return 'Item successfully deleted';
        } else {
            throw new Error(`Record with ID = ${id} does not exist or could not been deleted`);
        }
    }

    static async updateOne(input) {
        //validate input
        await validatorUtil.validateData('validateForUpdate', this, input);
        input = attachment.preWriteCast(input)
        try {
            let result = await this.sequelize.transaction(async (t) => {
                let to_update = await super.findByPk(input[this.idAttribute()]);
                if (to_update === null) {
                    throw new Error(`Record with ID = ${input[this.idAttribute()]} does not exist`);
                }

                let updated = await to_update.update(input, {
                    transaction: t
                });
                return updated;
            });
            attachment.postReadCast(result.dataValues)
            attachment.postReadCast(result._previousDataValues)
            return result;
        } catch (error) {
            throw error;
        }
    }

    static bulkAddCsv(context) {

        let delim = context.request.body.delim;
        let cols = context.request.body.cols;
        let tmpFile = path.join(os.tmpdir(), uuidv4() + '.csv');

        context.request.files.csv_file.mv(tmpFile).then(() => {

            fileTools.parseCsvStream(tmpFile, this, delim, cols).then((addedZipFilePath) => {
                try {
                    console.log(`Sending ${addedZipFilePath} to the user.`);

                    let attach = [];
                    attach.push({
                        filename: path.basename("added_data.zip"),
                        path: addedZipFilePath
                    });

                    email.sendEmail(helpersAcl.getTokenFromContext(context).email,
                        'ScienceDB batch add',
                        'Your data has been successfully added to the database.',
                        attach).then(function(info) {
                        fileTools.deleteIfExists(addedZipFilePath);
                        console.log(info);
                    }).catch(function(err) {
                        fileTools.deleteIfExists(addedZipFilePath);
                        console.error(err);
                    });

                } catch (error) {
                    console.error(error.message);
                }

                fs.unlinkSync(tmpFile);
            }).catch((error) => {
                email.sendEmail(helpersAcl.getTokenFromContext(context).email,
                    'ScienceDB batch add', `${error.message}`).then(function(info) {
                    console.error(info);
                }).catch(function(err) {
                    console.error(err);
                });

                fs.unlinkSync(tmpFile);
            });



        }).catch((error) => {
            throw new Error(error);
        });

        return `Bulk import of attachment records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
    }

    /**
     * csvTableTemplate - Allows the user to download a template in CSV format with the
     * properties and types of this model.
     *
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the
     * GraphQL response will have a non empty errors property.
     */
    static async csvTableTemplate(benignErrorReporter) {
        return helper.csvTableTemplate(definition);
    }



    /**
     * add_book_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   book_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_book_id(id, book_id) {
        let updated = await attachment.update({
            book_id: book_id
        }, {
            where: {
                id: id
            }
        });
        return updated;
    }

    /**
     * remove_book_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   book_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_book_id(id, book_id) {
        let updated = await attachment.update({
            book_id: null
        }, {
            where: {
                id: id,
                book_id: book_id
            }
        });
        return updated;
    }





    /**
     * bulkAssociateAttachmentWithBook_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateAttachmentWithBook_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "book_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            book_id,
            id
        }) => {
            promises.push(super.update({
                book_id: book_id
            }, {
                where: {
                    id: id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }


    /**
     * bulkDisAssociateAttachmentWithBook_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateAttachmentWithBook_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "book_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            book_id,
            id
        }) => {
            promises.push(super.update({
                book_id: null
            }, {
                where: {
                    id: id,
                    book_id: book_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }



    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */
    static idAttribute() {
        return attachment.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return attachment.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of attachment.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[attachment.idAttribute()]
    }

    static get definition() {
        return definition;
    }

    static base64Decode(cursor) {
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }

    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    stripAssociations() {
        let attributes = Object.keys(attachment.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    static externalIdsObject() {
        return {};
    }

}