const chai = require('chai');
const expect = chai.expect;
const rewire = require('rewire');
const helper = rewire('../utils/helper');
const _ = require('lodash');

chai.use(require('chai-as-promised'));

describe('Non-empty array', function() {
    it('1. Undefined', function() {
        let val = undefined;
        expect(helper.isNonEmptyArray(val)).to.be.false;
    });

    it('2. Null', function() {
        let val = null;
        expect(helper.isNonEmptyArray(val)).to.be.false;
    });

    it('3. Simple type', function() {
        let val = 0;
        expect(helper.isNonEmptyArray(val)).to.be.false;
    });

    it('4. Empty Object', function() {
        let val = {};
        expect(helper.isNonEmptyArray(val)).to.be.false;
    })

    it('5. Object', function() {
        let val = {zero: 0, one: 1};
        expect(helper.isNonEmptyArray(val)).to.be.false;
    });

    it('6. Empty Array', function() {
        let val = [];
        expect(helper.isNonEmptyArray(val)).to.be.false;
    });

    it('7. Non-Empty Array', function() {
        let val = [0];
        expect(helper.isNonEmptyArray(val)).to.be.true;
    });
});

describe('Not undefined and not null', function() {
    it('1. Undefined', function() {
        let val = undefined;
        expect(helper.isNotUndefinedAndNotNull(val)).to.be.false;
    });

    it('2. Null', function() {
        let val = null;
        expect(helper.isNotUndefinedAndNotNull(val)).to.be.false;
    })

    it('3. Zero', function() {
        let val = 0;
        expect(helper.isNotUndefinedAndNotNull(val)).to.be.true;
    })

    it('4. Simple type', function() {
        let val = 1;
        expect(helper.isNotUndefinedAndNotNull(val)).to.be.true;
    })

    it('5. Empty Object', function() {
        let val = {};
        expect(helper.isNotUndefinedAndNotNull(val)).to.be.true;
    })

    it('6. Object', function() {
        let val = {zero: 0, one: 1};
        expect(helper.isNotUndefinedAndNotNull(val)).to.be.true;
    })

    it('7. Empty Array', function() {
        let val = [];
        expect(helper.isNotUndefinedAndNotNull(val)).to.be.true;
    })

    it('8. Array', function() {
        let val = [0];
        expect(helper.isNotUndefinedAndNotNull(val)).to.be.true;
    })
})

describe('Count Records in Association Arguments', function() {
    it('1. Integers first test', function() {
        expect(helper.countRecordsInAssociationArgs({addDogs: 2, addCats: 1}, ['addDogs', 'addCats'])).to.equal(2);
    })
    it('2. Integer second test', function() {
        expect(helper.countRecordsInAssociationArgs({addDogs: 2, addCats: 1, addHamsters: 1}, ['addDogs', 'addCats', 'addHamsters'])).to.equal(3);
    })
    it('3. Arrays first test', function() {
        expect(helper.countRecordsInAssociationArgs({addDogs: [4, 2], addCats: 1}, ['addDogs', 'addCats'])).to.equal(3);
    })
    it('4. Arrays second test', function() {
        expect(helper.countRecordsInAssociationArgs({addDogs: [4, 2], addCats: 1, addHamsters: 1}, ['addDogs', 'addCats', 'addHamsters'])).to.equal(4);
    })
});

describe('Check and Adjust Record Limit For Create or Update', function() {
  it('1. Should return 3 & context.recordLimit = 1', function() {
    let input = {addDogs: 2, addCats: 1};
    let context = {recordLimit: 4};
    let associationArgsDef = {addDogs: 'dog', addCats: 'cat'};
    expect(helper.checkAndAdjustRecordLimitForCreateUpdate(input, context, associationArgsDef)).to.equal(3);
    expect(context.recordLimit).to.equal(1);
  });
  it('2. Should return totalCount=4 & context.recordLimit=0', function() {
    let input = {addDogs: [1,2], addCats: 1};
    let context = {recordLimit: 4};
    let associationArgsDef = {addDogs: 'dog', addCats: 'cat'};
    expect(helper.checkAndAdjustRecordLimitForCreateUpdate(input, context, associationArgsDef)).to.equal(4);
    expect(context.recordLimit).to.equal(0);
  });

  it('3. Should throw an error & context.recordLimit=4', function() {
    let input = {addDogs: [1,2], addCats: [1, 2, 3, 4, 5]};
    let context = {recordLimit: 4};
    let associationArgsDef = {addDogs: 'dog', addCats: 'cat'};
    expect(helper.checkAndAdjustRecordLimitForCreateUpdate.bind(input, context, associationArgsDef)).to.throw(Error);
    expect(context.recordLimit).to.equal(4);
  });
});

describe('Unique', function() {
    it('1. Unique array test', function() {
        expect(helper.unique([1, 1, 2, 3, 2])).to.deep.equal([1, 2, 3]);
    });

    it('2. Unique without sorting', function() {
        expect(helper.unique([2, 3, 2, 4, 1, 5])).to.deep.equal([2, 3, 4, 1, 5]);
    })
})

describe('Sanitize association arguments', function() {
    it('1, NOP for already sane arguments', function() {
        const firstArguments = {name: 'FirstPerson', addDogs: [4, 2], addCats: 1, addHamsters: 2};
        let originalArguments = Object.assign({}, firstArguments);
        let newArguments = helper.sanitizeAssociationArguments(originalArguments, ['addDogs', 'addCats', 'addHamsters']);
        expect(newArguments).to.deep.equal(firstArguments);
        expect(originalArguments).to.deep.equal(firstArguments);
    })

    it('2. One argument to be sanitized', function() {
        const firstArguments = {name: 'SecondPerson', addDogs: [4, 2, 4, 3], addCats: 1, addHamsters: 2};
        let originalArguments = Object.assign({}, firstArguments);
        let newArguments = helper.sanitizeAssociationArguments(originalArguments, ['addDogs', 'addCats', 'addHamsters']);
        expect(newArguments).to.deep.equal({name: 'SecondPerson', addDogs: [4, 2, 3], addCats: 1, addHamsters: 2});
        expect(originalArguments).to.deep.equal(firstArguments);
    })

    it('3. All arguments to be sanitized', function() {
        const firstArguments = {name: 'ThirdPerson', addDogs: [4, 2, 4, 3], addCats: [1, 1, 2], addHamsters: [2, 2]};
        let originalArguments = Object.assign({}, firstArguments);
        let newArguments = helper.sanitizeAssociationArguments(originalArguments, ['addDogs', 'addCats', 'addHamsters']);
        expect(newArguments).to.deep.equal({name: 'ThirdPerson', addDogs: [4, 2, 3], addCats: [1, 2], addHamsters: [2]});
        expect(originalArguments).to.deep.equal(firstArguments);
    })
})

describe('Check authorization on association args', function() {
    var oldModelIndex;
    var oldModulExports;
    var oldCheckAuthorization;

    const associationArgsDef = {
        'addPerson': 'Person',
        'removePerson': 'Person',
        'addDogs': 'Dog', 
        'removeDogs': 'Dog', 
        'addCat': 'Cat',
        'removeCat': 'Cat'
      }

    before(function() {
        oldModelIndex = helper.__set__('models_index', {
            Person: {
                definition: {storageType: 'sql'}
            },
            Dog: {
                definition: {storageType: 'sql'}
            },
            Cat: {
                definition: {storageType: 'distributed-data-model'},
                adapterForIri: id => {
                    if (id % 2 == 1) {
                        return 'oddCat';
                    }
                    return 'evenCat';
                },
                registeredAdapters: {
                    oddCat: 'odd',
                    evenCat: 'even'
                }
            }
        });
        oldModulExports = helper.__set__('module.exports.authorizedAdapters', 
            async (context, adapters, curr) => {
                let res = {};
                let errors = [];
                adapters.forEach(element => {
                    if (element === 'odd') {
                        errors.push(new Error('Too odd'));
                    }
                });
                res.authorizationErrors = errors;
                return await Promise.resolve(res);
            }
        );
        oldCheckAuthorization = helper.__set__('checkAuthorization', async (context, targetModelName, curr) => {
            if (targetModelName === 'dog') {
                throw new Error('Dogs are not allowed in here');
            }
            return await Promise.resolve(true);
        });
    })

    after(function() {
        oldCheckAuthorization();
        oldModulExports();
        oldModelIndex();
    })

    it('1. Person only is allowed', async function() {
        let input = {addPerson: 1};
        let context = null;
        expect(await helper.checkAuthorizationOnAssocArgs(input, context, associationArgsDef)).to.be.true;
    });

    it('2. Dog is always forbidden', async function() {
        let input = {addDog: 1};
        let context = null;
        expect(await helper.checkAuthorizationOnAssocArgs(input, context, associationArgsDef)).to.throw;
    })
    
    it('3. Even cat is allowed', async function() {
        let input = {addCat: 2};
        let context = null;
        expect(await helper.checkAuthorizationOnAssocArgs(input, context, associationArgsDef)).to.be.true;
    })

    it('4. Odd cat is forbidden', async function() {
        let input = {addCat: 1};
        let context = null;
        expect(await helper.checkAuthorizationOnAssocArgs(input, context, associationArgsDef)).to.throw;
    })

    it('5. Allowed when all allowed', async function() {
        let input = {addPerson: 1, addCat: 2};
        let context = null;
        expect(await helper.checkAuthorizationOnAssocArgs(input, context, associationArgsDef)).to.be.true;
    })

    it('6. Forbidden when one is forbidden', async function() {
        let input = {addPerson: 1, addDog: 1, addCat: 2};
        let context = null;
        expect(await helper.checkAuthorizationOnAssocArgs(input, context, associationArgsDef)).to.throw;
    })

    it('7. Delete allowed', async function() {
        let input = {deletePerson: 1};
        let context = null;
        expect(await helper.checkAuthorizationOnAssocArgs(input, context, associationArgsDef)).to.be.true;
    })

    it('8. Delete forbidden', async function() {
        let input = {deleteDog: 1};
        let context = null;
        expect(await helper.checkAuthorizationOnAssocArgs(input, context, associationArgsDef)).to.throw;
    })
})

describe('Validate existence', function() {
    let model = {
        adapterForIri: id => { return 'theAdapter'},
        registeredAdapters: {
            theAdapter: "adapterReturn"
        },
        idAttribute: function() {return "ID"},
        readById: async function() {return {}},
        countRecords: async (search, responsibleAdapter) => {
            let idsPresent = ["1", "2", "4"];
            if (search.field !== 'ID') {
                throw new Error('Wrong ID field: ' + search.field);
            }
            if (search.operator !== 'in') {
                throw new Error('Only operator \'in\' is supported');
            }
            if (search.value.type !== 'Array') {
                throw new Error('An Array must be given as search value');
            }
            if (!_.isEqual(responsibleAdapter, ['adapterReturn'])) {
                throw new Error(`Wrong adapter given: ` + JSON.stringify(responsibleAdapter));
            }
            let numberOfPresentIds = 0;
            for (let id of search.value.value.split(",")) {
                if (idsPresent.includes(id)) {
                    numberOfPresentIds++;
                }
            }
            return numberOfPresentIds;
        },
        definition: {model: 'Testmodel'}
    }

    let localModel = {
        idAttribute: function() {return "ID"},
        readById: function() {return {}},
        countRecords: async (search) => {
            let idsPresent = ["2", "3"];
            if (search.field !== 'ID') {
                throw new Error('Wrong ID field: ' + search.field);
            }
            if (search.operator !== 'in') {
                throw new Error('Only operator \'in\' is supported');
            }
            if (search.value.type !== 'Array') {
                throw new Error('An Array must be given as search value');
            }
            let numberOfPresentIds = 0;
            for (let id of search.value.value.split(",")) {
                if (idsPresent.includes(id)) {
                    numberOfPresentIds++;
                }
            }
            return numberOfPresentIds;
        },
        definition: {model: 'Testmodel-lokal'}
    }

    let noCountModel = {
        idAttribute: function() {return "ID"},
        readById: async (id) => {
            switch (id) {
                case 1: return 1;
                case 2: return 2;
                case 3: return 3;
                case 4: return undefined;
                case 5: return 5;
                default: throw new Error('ID unknown: ' + id);
            }
        },
        definition: {model: 'Testmodel without count'}
    }

    it('1. ID 1 should exist', async function() {
        await expect(helper.validateExistence(1, model)).to.be.eventually.fulfilled;
    })

    it('2. ID 3 should not exist', async function() {
        await expect(helper.validateExistence(3, model)).to.be.rejectedWith(Error);
    })

    it('3. ID 1, 2 and 4 should exist', async function() {
        await expect(helper.validateExistence([1, 2, 4], model)).to.be.eventually.fulfilled;
    })

    it('4. ID 1, 2 and 3 should throw an Error', async function() {
        await expect(helper.validateExistence([1, 2, 3], model)).to.be.rejectedWith(Error);
    })

    it('5. Local ID 1 should not exist', async function() {
        await expect(helper.validateExistence(1, localModel)).to.be.rejectedWith(Error);
    })

    it('6. Local ID 2 should exist', async function() {
        await expect(helper.validateExistence(2, localModel)).to.be.eventually.fulfilled;
    })

    it('7. Local ID 2 and 3 should exist', async function() {
        await expect(helper.validateExistence([2, 3], localModel)).to.be.eventually.fulfilled;
    })

    it('8. Local ID 1 and 2 should throw an error', async function() {
        await expect(helper.validateExistence([1, 2], localModel)).to.be.rejectedWith(Error);
    })

    it('9. Local ID 4 should not exist', async function() {
        await expect(helper.validateExistence(4, localModel)).to.be.rejectedWith(Error);
    })

    it('10. NCM ID 1 should exist', async function() {
        await expect(helper.validateExistence(1, noCountModel)).to.be.eventually.fulfilled;
    })

    it('11. NCM ID 4 should not exist', async function() {
        await expect(helper.validateExistence(4, noCountModel)).to.be.rejectedWith(Error);
    })

    it('12. NCM ID 1, 2, 3 should all exist', async function() {
        await expect(helper.validateExistence([1, 2, 3], noCountModel)).to.be.eventually.fulfilled;
    })

    it('13. NCM ID 1, 2, 4 should throw', async function() {
        await expect(helper.validateExistence([1, 2, 4], noCountModel)).to.be.rejectedWith(Error);
    })

})

describe('Validate association arguments\' existence', function() {
    

    let Dog = {
        idAttribute: function() {return "ID"},
        readById: function() {return {}},
        countRecords: async (search) => {
            let idsPresent = ["2", "3"];
            if (search.field !== 'ID') {
                throw new Error('Wrong ID field');
            }
            if (search.operator !== 'in') {
                throw new Error('Only operator \'in\' is supported');
            }
            if (search.value.type !== 'Array') {
                throw new Error('An Array must be given as search value');
            }
            let numberOfPresentIds = 0;
            for (let id of search.value.value.split(",")) {
                if (idsPresent.includes(id)) {
                    numberOfPresentIds++;
                }
            }
            return numberOfPresentIds;
        },
        definition: {model: 'Dog'}
    }

    let Cat = {
        idAttribute: function() {return "ID"},
        readById: function() {return {}},
        countRecords: async (search) => {
            let idsPresent = ["2", "3", "4"];
            if (search.field !== 'ID') {
                throw new Error('Wrong ID field');
            }
            if (search.operator !== 'in') {
                throw new Error('Only operator \'in\' is supported');
            }
            if (search.value.type !== 'Array') {
                throw new Error('An Array must be given as search value');
            }
            let numberOfPresentIds = 0;
            for (let id of search.value.value.split()) {
                if (idsPresent.includes(id)) {
                    numberOfPresentIds++;
                }
            }
            return numberOfPresentIds;
        },
        definition: {model: 'Cat'}
    }

    let Hamster = {
        idAttribute: function() {return "ID"},
        readById: function() {return {}},
        countRecords: async (search) => {
            let idsPresent = ["2", "3", "4", "5"];
            if (search.field !== 'ID') {
                throw new Error('Wrong ID field');
            }
            if (search.operator !== 'in') {
                throw new Error('Only operator \'in\' is supported');
            }
            if (search.value.type !== 'Array') {
                throw new Error('An Array must be given as search value');
            }
            let numberOfPresentIds = 0;
            for (let id of search.value.value.split(",")) {
                if (idsPresent.includes(id)) {
                    numberOfPresentIds++;
                }
            }
            return numberOfPresentIds;
        },
        definition: {model: 'Hamster'}
    }

    let Employer = {
        idAttribute: function() {return "ID"},
        readById: function() {return {}},
        countRecords: async (search) => {
            let idsPresent = ["1", "2","3","5"];
            if (search.field !== 'ID') {
                throw new Error('Wrong ID field');
            }
            if (search.operator !== 'in') {
                throw new Error('Only operator \'in\' is supported');
            }
            if (search.value.type !== 'Array') {
                throw new Error('An Array must be given as search value');
            }
            let numberOfPresentIds = 0;
            for (let id of search.value.value.split(",")) {
                if (idsPresent.includes(id)) {
                    numberOfPresentIds++;
                }
            }
            return numberOfPresentIds;
        },
        definition: {model: 'Employer'}
    }

    const associationArgsDef = {
        'addDogs': 'Dog',
        'removeDogs': 'Dog',
        'addCats': 'Cat',
        'removeCats': 'Cat',
        'addHamsters': 'Hamster',
        'removeHamsters': 'Hamster',
        'addEmployer': 'Employer',
        'removeEmployer': 'Employer'
    }

    before(function() {
        setOldModelIndex = helper.__set__('models_index', {
            Dog: Dog,
            Cat: Cat,
            Hamster: Hamster,
            Employer: Employer
        });
    })

    after(function() {
        setOldModelIndex();
    })

    it('01. Single existing dog', async function() {
        let input = {addDogs: 2};
        await expect(helper.validateAssociationArgsExistence(input, null, associationArgsDef)).to.be.eventually.fulfilled;
    })

    it('02. Single non-existing dog', async function() {
        let input = {addDogs: 1};
        await expect(helper.validateAssociationArgsExistence(input, null, associationArgsDef)).to.be.rejectedWith(Error);
    })

    it('03. Single existing cat', async function() {
        let input = {addCats: 4};
        await expect(helper.validateAssociationArgsExistence(input, null, associationArgsDef)).to.be.eventually.fulfilled;
    })

    it('04. Existing records from all types', async function() {
        let input = {addDogs: [2, 3], addCats: 4, addHamsters: 5, addEmployer: 1};
        await expect(helper.validateAssociationArgsExistence(input, null, associationArgsDef)).to.be.eventually.fulfilled;
    })

    it('05. Non-existing records from all types', async function() {
        let input = {addDogs: 1, addCats: [5, 6], addHamsters: 1, addEmployer: 4};
        await expect(helper.validateAssociationArgsExistence(input, null, associationArgsDef)).to.be.rejectedWith(Error);
    })

    it('06. Mixing existing and non-existing records from all types', async function() {
        let input = {addDogs: 2, addCats: [5, 6], addHamsters: 1, addEmployer: 4};
        await expect(helper.validateAssociationArgsExistence(input, null, associationArgsDef)).to.be.rejectedWith(Error);
    })
})
