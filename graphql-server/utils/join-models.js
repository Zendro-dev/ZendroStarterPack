
// TODO: JOIN: do not print anything if there is no data found, print that there is no data found


//TODO: Web service generates a class object that is incompatible with
//TODO: sequelize object. All types of models shell have the same interface to
//TODO: proceed with generic JOIN. That's clearly a new issue.


const _ = require('lodash');
const path = require('path');
const models = require(path.join(__dirname, '..', 'models' ,'index.js'));
const resolvers = require(path.join(__dirname, '..', 'resolvers', 'index.js'));
const inflection = require('inflection');
const checkAuthorization = require('./check-authorization');
const schema = require('./graphql_schema');
let LinkedList = require('linked-list');



/**
 *
 * INPUT FORMAT DESCRIPTION
 *
 * The "modelAdjacencies" input parameter is an ordered array of JSON objects that describe a JOIN chain.
 * Below goes an example of the currently supported parameter set:
 *
 * {
 *
 *   outputFormat = CSV                     // (REQUIRED) For the moment can be TEST, CSV or JSON only, see
 *                                          // the corresponding module exports
 *
 *
 *   modelAdjacencies =                     // (REQUIRED)
 *   [
 *   {
 *     "name" : "individual",               // Name of the model as it appears in the corresponding index.js
 *
 *
 *     "association_name" : "transcript_counts",
 *                                          // (REQUIRED) There can be more than one association between two models,
 *                                          // the way to differ between these associations is an "as_name"
 *                                          // used by sequelize. This name is used by codegen to create resolvers and
 *                                          // is used here to find them.
 *
 *
 *
 *     "attributes" : [                     // (OPTIONAL - not implemented) The resolvers does not give possibility
 *                                          // to filter out unnecessary columns of the table. However, is is easy
 *                                          // to implement this functionality inside a "constructRow" function. This way
 *                                          // it can be possible to create different cut-offs of the database at the
 *                                          // presentation level and resolve the data analysis problem at a low cost.
 *         "name",
 *         "createdAt"
 *     ],
 *
 *     <, "search" : {...}, "order" : {...}>// (OPTIONAL) Can be specified to filter records at the head of the
 *                                          // JOIN chain.
 *
 *
 *   },
 *   {
 *     "name" : "transcript_count",
 *                                          // The last element of the association chain does not require an "assoc"
 *                                          // structure, it has no sense here and will be ignored if present.
 *
 *     "search" : {                         // (OPTIONAL) In the case when as_type of the previous element is "hasMany" or
 *                                          // "belongsToMany", there can be more than one "transcript_count" record
 *         "field" : "name",                // associated with the same "individual".
 *         "value" : {                      // The "transcript_count" records can be filtered and ordered
 *                     "value" : "%A%"      // correspondingly to these "search" and "order" parameters. In the case of
 *                    },                    // "hasOne" or "belongsToOne" as_type of the "individual", the "search" and
 *         "operator" : "like"              // "order" parameters will be ignored.
 *     },
 *
 *     order: [{field: name, order: DESC}]  // (OPTIONAL) Ordering of the associated "transcript_count" records.
 *   }
 *   ]
 * }
 *
 * PERMISSIONS
 *
 * The user role should have a "batch_download" permission for all models defined in the
 * "modelAdjacencies" input parameter.
 *
 */

class JoinModels {

    /**
     * Internal class parameters
     */
    constructor(context){

        // a linked list to be initialized from the input adjacency array
        // this list will always keep the current model and the next model that is more useful than
        // a plain array
        this.list = new LinkedList;

        // request context
        this.context = context;
    }

    /**
    * joinModels - is a function called by express server directly. This function execution can take
    * a long time so it should not be blocking and should not produce long call stack chains

    * @param modelAdjacencies    a number of parameters in JSON format that define a JOIN request (see below)
    * @param httpWritableStream  a writable http stream
    * @returns {Promise}         generally a void function
    */

    async run(params, httpWritableStream) {

        let modelAdjacencies = params.modelAdjacencies;
        if ( ! modelAdjacencies || modelAdjacencies.length === 0)
            throw Error(`modelAdjacencies array is undefined`);

        // a linked list to be initialized from the input adjacency array
        // this list will always keep the current model and the next model that is more useful than
        // a plain array
        //let list = new LinkedList;

        for(let model_adj of modelAdjacencies) {
            let item = new LinkedList.Item();
            item.model_adj = model_adj;
            this.list.append(item);
        }

        // iterate over the list and add some useful information to it's elements
        let cur = this.list.head;
        do{
            // check for permission to make batch_download for all models listed
            if( ! await checkAuthorization(this.context, cur.model_adj.name, 'batch_download'))
                return new Error(`You don't have authorization to perform batch download for the ${cur.model_adj.name} model`);

            // required on this step input data validation
            if( ! cur.model_adj.name ) throw Error(`Model name is not defined in ${JSON.stringify(cur.model_adj)}`);
            if( ! models[cur.model_adj.name] ) throw Error(`Model with name ${cur.model_adj.name} not exist`);

            // store raw names of the model attributes if not given at input
            let all_attributes = schema.getModelFieldByAnnotation(cur.model_adj.name,'@original-field');
            if( ! cur.model_adj.attributes ) {
                cur.model_adj.attributes = all_attributes;
            }else{
                // check that specified attributes are correct
                for (let attribute_name of cur.model_adj.attributes)
                    if( ! all_attributes.includes(attribute_name))
                        throw Error(`Requested attribute '${attribute_name}' is not defined in the model '${cur.model_adj.name}'`);
            }

            // current data (is initialized by the 'func_find' call)
            cur.model_adj.data = null;

            // in the case when SELECT query that is formed by func_find method can return
            // a collection of database records, those can be filtered and ordered accordingly
            // to "find_params" structure. This structure also includes "offset" initialized to 0
            cur.model_adj.search_params = this.defineSearchParams(cur);

            // function that searches by criteria and offset instances of the given model_adj
            cur.model_adj.func_find = this.defineFindFunction(cur);

        }while(null !== (cur = cur.next));


        // http send stream header
        let timestamp = new Date().getTime();
        httpWritableStream.writeHead(200, {'Content-Type': 'application/force-download',
            'Content-disposition': `attachment; filename = ${timestamp}.json`});


        /*
            This is the main introspection loop. On each iteration the user would receive
            a new data raw. Accordingly to implementation of the constructRow function there
            is a possibility to generate different output formats, hide unnecessary columns, etc.
            This functionality is out of the scope of the current class and the constructRow
            implementation has to be overloaded to output real data. See the child classes to get
            more information.
         */
        while(true){

            // entering into the iterations from the head element
            cur = this.list.head;

            try {

                while(true){
                    let rollback = false;

                    // query the database (see defineFindFunction for details)
                    cur = await cur.model_adj.func_find(cur, this.context);

                    // no data found for the cur element of association chain => print, rollback or exit
                    if(cur.model_adj.data === null){

                        // cur element was visited for the first time: augment offset and print the line
                        if(cur.model_adj.search_params.pagination.offset === 0){
                            cur = this.augmentOffsetFlushTrailing(cur);
                            break;

                            // cur element was visited before and has no data
                        }else{

                            // head has no more data, terminate
                            if(cur.prev === null){
                                return;

                                // cur has no data and was already printed
                                // goto prev, augment it's offset and try again
                            }else{
                                cur = cur.prev;
                                cur = this.augmentOffsetFlushTrailing(cur);
                                rollback = true;
                            }
                        }
                    }

                    // the last element was reached and it has data != null
                    if(cur.next === null){
                        cur = this.augmentOffsetFlushTrailing(cur);
                        break;
                    }

                    // if it's not a rollback run - explore the next element
                    if(!rollback)
                        cur = cur.next;
                }

                /*
                    Send joined data raw to the end-user accordingly to the constructRow implementation.

                    It should be stressed, that after the first element with data == null, all subsequent elements
                    have no valid data. Also, as long as offsets are used to check if a given element was
                    already visited (printed) or not, the offsets should not be modified within constructRow function,
                    and it's interpretation is not direct.
                 */

                let row_string = this.constructRow(this.list.head);
                await httpWritableStream.write(row_string);

            }catch(err){
                /*
                    We can't throw an error to Express server at this stage because the response Content-Type
                    was already sent. So we can try to attach it to the end of file.
                 */
                console.log(err);
                await httpWritableStream.write(`{error : ${err.message}}\n`);
                return;
            }
        }
    };


    /**
     *  defineFindFunction - Function use offset to retrieve corresponding data for the current list element according
     *  to the current offset. This function will renew the cur.model_adj.data and augment
     *  the cur.model_adj.offset field. If there is no data for the current offset, the
     *  cur.model_adj.data will be set to null.
     *
     *  It is assumed, that cur->prev element has already initialized it's data field. If cur->prev is null, it means that
     *  we are working with the list head. If after calling this function, the cur.model_adj.data is null,
     *  it means that there is nothing mode to do, and the JOIN process has successfully completed.
     *
     *  @param {object}  cur      is a current element of the linked-list
     *  @return {function}        returns a function used inside generic algorithm
     */

    defineFindFunction(cur){


        if(cur.prev === null){

            // cur is the head element of the list
            return async function(cur, context){

                // for head getter function has to be estimated just once
                if( ! cur.model_adj.func_getter)
                    cur.model_adj.func_getter = resolvers[inflection.pluralize(cur.model_adj.name)];

                // get record from database for the given offset
                // an output is an array that have one or zero elements
                cur.model_adj.data =  await cur.model_adj.func_getter(cur.model_adj.search_params, context);

                if( cur.model_adj.data.length === 0 ) {
                    cur.model_adj.data = null;
                }else{
                    cur.model_adj.data = cur.model_adj.data[0];
                }

                return cur;
            }

        } else {

            /*
              Here an explicit check is applied to detect for the association getter function in the cur.prev data model.
              At the same time this is a validator (see the "else" option).
             */

            let model_prev = models[cur.prev.model_adj.name];

            const as_name = cur.prev.model_adj.association_name;
            if( ! as_name ) throw Error('"assoc" structure is required, see the docs');

            //<%- nameLc -%>.prototype.<%=associations_one[i].name%>
            let func_toOneGetter = model_prev.prototype[as_name];

            //<%- nameLc -%>.prototype.<%=associations_temp[i].name%>Filter
            let func_toManyGetter = model_prev.prototype[`${as_name}Filter`];

            if(typeof func_toOneGetter === "function"){

                // there is just one cur element can be found from the cur.prev that
                // corresponds to the hasOne or belongsTo of the prev->cur association type
                return async function(cur, context){
                    const as_name = cur.prev.model_adj.association_name;

                    if(cur.model_adj.search_params.pagination.offset > 0){
                        cur.model_adj.data = null;
                    }else{
                        cur.model_adj.data = await cur.prev.model_adj.data[as_name]({},context);
                        if(!cur.model_adj.data)
                            cur.model_adj.data = null;
                    }

                    return cur;
                }
            } else if(typeof func_toManyGetter === "function"){

                return async function(cur, context){

                    // get record from database for the current offset (it comes inside cur.model_adj.search_params data structure)
                    // an output is an array that would have one (because limit is always 1) or zero elements (if nothing was found)
                    cur.model_adj.data = await cur.prev.model_adj.data[`${inflection.pluralize(cur.model_adj.name)}Filter`](cur.model_adj.search_params, context);

                    // set data to null explicitly or remove an array wrapper (anyway there is just one element)
                    if( cur.model_adj.data.length === 0 ){
                        cur.model_adj.data = null;
                    }else{
                        cur.model_adj.data = cur.model_adj.data[0];
                    }

                    return cur;
                }
            } else{
                /*
                 If you get this error, it means that there is no explicit link between cur.prev and cur elements.
                 For example, assume that model A belongsTo model B. However, the madel B does not have a corresponding
                 hasMany or hasOne association with A. If you try to make a JOIN in the order B -> A, you will get
                 this "No association" exception. However, if you JOIN these models in the order A -> B, the corresponding
                 association resolver will be found.

                 Currently all associations are inverse, so this error should never happen.
                */

                throw Error(`No association from ${cur.prev.model_adj.name} to ${cur.model_adj.name} was detected,` +
                `please check for ${as_name} or ${as_name}Filter functions`);
            }

        }

    };





    /**
     *   defineSearchParams - a helper function fills up a serach_params data structure. It's 'search' and 'order'
     *   elements would never change during the given transmission session. However the pagination
     *   parameter is important. The limit shell always be 1, and the offset is internal parameter of
     *   the current algorithm. It is prohibited to alter offset values from the outside world.
     *
     *   @param {object}  cur      is a current element of the linked-list
     *   @return {object}          returns a structure of search params
     */
    defineSearchParams(cur){
        let search_params = {};

        search_params.pagination = {
            offset : 0,
            limit : 1
        };

        if( cur.model_adj.search )
            search_params.search = cur.model_adj.search;

        if( cur.model_adj.order )
            search_params.order = cur.model_adj.order;

        return search_params;
    };




    /**
     *   augmentOffsetFlushTrailing - Helper function is used to augment offset of the "cur" element.
     *   In this case offsets and data of the all trailing elements became invalid
     *   and shell be flushed.
     *
     *   @param {object}  cur      is a current element of the linked-list
     *   @return {object}          returns a cur element with offset augmented that points on to the cleaned up tail
     */
    augmentOffsetFlushTrailing(cur){
        cur.model_adj.search_params.pagination.offset++;
        let next = cur.next;
        while(next !== null){
            next.model_adj.search_params.pagination.offset = 0;
            next.model_adj.data = null;
            next = next.next;
        }
        return cur;
    };


    /**
     * constructRow - basic implementation of the constructRow function that prints model names and id's
     *of the found elements. It is useful for testing purposes.
     *...
     *individual[id:458] ->transcript_count[id:6]
     *individual[id:459] ->transcript_count[id:2]
     *individual[id:460]
     *individual[id:461]
     *
     * @param  {object}   head  head of the linked list
     * @return {string}   joined line
     */
    constructRow(head){
        let str = "";

        let cur = head;
        do{
            str = str.concat(`${cur.model_adj.name}[`);
            str = str.concat(`id:${cur.model_adj.data.id}] `);

            if(cur.next !== null && cur.next.model_adj.data === null)
                break;

            if(cur.next !== null)
                str = str.concat("->");

        }while(null !== (cur = cur.next));

        str = str.concat("\n");

        return str;
    }


};



// *********************************************************************************************************************



class JoinModelsJSON extends JoinModels{

    /**
     * Internal class parameters
     */
    constructor(context){
        super(context);
    }

    /**
     * constructRow - create text string for the joined line in JSON format
     *
     * Example output for filtered columns:
     * ...
     * {"transcript_count.id":8,"individual.id":463}
     * {"transcript_count.id":9,"individual.id":null}
     * {"transcript_count.id":10,"individual.id":462}
     * ...
     *
     * @param  {object}   head  head of the linked list
     * @return {string}   a text string that will be sent to the service client
     */

    constructRow(head){

        let cur = head;
        let joined_data = {};
        do{

            let data = {};

            if(cur.model_adj.data === null){
                for (let attr of cur.model_adj.attributes) {
                    data[cur.model_adj.name + "." + attr] = null;
                }
            }else{
                data = _.pick(cur.model_adj.data, cur.model_adj.attributes);

                for(let old_key of Object.keys(data)){
                    let new_key = cur.model_adj.name + "." + old_key;
                    Object.defineProperty(data, new_key,
                        Object.getOwnPropertyDescriptor(data, old_key));
                    delete data[old_key];
                }
            }

            Object.assign(joined_data, data);

        }while(null !== (cur = cur.next));

        return JSON.stringify(joined_data) + "\n";
    };
};


class JoinModelsCSV extends JoinModels{
    /**
     * Internal class parameters
     */
    constructor(context){
        super(context);

        // in CSV format first line is the title
        this.csv_header = true;
    }


    /**
     * constructRow - create text string for the joined line in CSV format
     *
     * Example output for filtered columns:
     *
     * transcript_count.id,individual.id
     * 8,463
     * 9,null
     * 10,462
     * ...
     *
     * @param  {object}   head  head of the linked list
     * @return {string}   a text string that will be sent to the service client
     */
    constructRow(head){

        let cur = head;

        let str = "";
        let header = "";

        do{

            for (let attr of cur.model_adj.attributes){

                if(this.csv_header)
                    header += cur.model_adj.name + "." + attr + ",";

                if(cur.model_adj.data === null || cur.model_adj.data[attr] === null){
                    str += `"NULL",`;
                }else{
                    str += `"${cur.model_adj.data[attr]}"` + ",";
                }
            }

        }while(null !== (cur = cur.next));

        if(this.csv_header){
            this.csv_header = false;
            header = header.replace(/.$/,"\n");
            header += str;
            str = header;
        }

        str = str.replace(/.$/,"\n");

        return str;
    };
}



module.exports.JoinModels = JoinModels;
module.exports.JoinModelsJSON = JoinModelsJSON;
module.exports.JoinModelsCSV = JoinModelsCSV;

/**********************************************************

CURL tests (copy-paste to console):

curl -d '{"outputFormat" : "JSON", "modelAdjacencies" : [ { "name"  : "individual", "association_name" : "transcript_counts" }, { "name" : "transcript_count"} ]}' -H "Content-Type: application/json" http://localhost:3000/join

curl -d '{"outputFormat" : "JSON", "modelAdjacencies" : [ { "name"  : "transcript_count", "association_name" : "individual" }, { "name" : "individual"} ]}' -H "Content-Type: application/json" http://localhost:3000/join

curl -d '{"outputFormat" : "JSON", "modelAdjacencies" : [ { "name"  : "transcript_count", "association_name" : "individual", "attributes" : ["id"] }, { "name" : "individual", "attributes" : ["id"]} ]}' -H "Content-Type: application/json" http://localhost:3000/join


curl -d '{"outputFormat" : "JSON", "modelAdjacencies" : [ { "name" : "individual", "attributes" : ["id", "name"], "search" : { "field" : "name", "value" : {"value" : "A"}, "operator" : "like" }, "order" : [{"field" : "name", "order" : "ASC" }] } ]}' -H "Content-Type: application/json" http://localhost:3000/join

curl -d '{"outputFormat" : "JSON", "modelAdjacencies" : [ { "name" : "transcript_count", "association_name" : "aminoacidsequence", "attributes" : [ "id", "gene"] } , {"name": "aminoacidsequence"} ]}' -H "Content-Type: application/json" http://localhost:3000/join

curl -d '{"outputFormat" : "JSON", "modelAdjacencies" : [ { "name": "aminoacidsequence", "attributes" : [ "id"], "association_name" : "transcript_counts"}, { "name" : "transcript_count" } ]}' -H "Content-Type: application/json" http://localhost:3000/join

*/
