const expect = require('chai').expect;
const testData = require('./test-data');
const models = require('./data-models');
ejs = require('ejs');
funks = require('../funks.js');

describe('Features Test', function(){
    let modelsObj = testData.modelsObj;

    //test router file
    it('Router index file', function(done){
      funks.renderTemplate('routes_index',modelsObj)
      .then( (file) =>{
        let created_routes = file.replace(/\s/g, '');
        let test_routes = testData.routes.replace(/\s/g, '');
        expect(created_routes).to.be.equal(test_routes);
        done();
      });
    });

    it('Request index file', function(done){
      funks.renderTemplate('request_index',modelsObj)
      .then( (file) =>{
        let created_index = file.replace(/\s/g, '');
        let test_index = testData.resquest_index.replace(/\s/g, '');
        expect(created_index).to.be.equal(test_index);
        done();
      });
    });
    //test navigation bar file
    it('Side navigation bar file', function(done){
      funks.renderTemplate('sideNav', modelsObj)
      .then( (file) =>{
        let created_sideNav = file.replace(/\s/g, '');
        let test_sideNav = testData.sideNav.replace(/\s/g, '');
        expect(created_sideNav).to.be.equal(test_sideNav);
        done();
      });
    });

});

describe('VueTable GraphQl Query', function(){
    let modelsObj = funks.fillOptionsForViews(models.book);
    it('VueTable  - book',async function(){
       let file = await funks.renderTemplate('tableView',modelsObj);
        let created_table = file.replace(/\s/g, '');
        let test_table = testData.book_table.replace(/\s/g, '');
        expect(created_table).to.be.equal(test_table);
    });

    let modelsObjDog = funks.fillOptionsForViews(models.dog);
    it('VueTable  - dog',async function(){
       let file = await funks.renderTemplate('tableView',modelsObjDog);
        let created_table = file.replace(/\s/g, '');
        let test_table = testData.dog_table.replace(/\s/g, '');
        expect(created_table).to.be.equal(test_table);
    });

    let modelsObjIndividual = funks.fillOptionsForViews(models.individual);
    it('VueTable  - individual',async function(){
       let file = await funks.renderTemplate('tableView',modelsObjIndividual);
        let created_table = file.replace(/\s/g, '');
        let test_table = testData.individual_table.replace(/\s/g, '');
        expect(created_table).to.be.equal(test_table);
    });

  });

  describe('FormElementVue ', function(){
      let modelsObj = funks.fillOptionsForViews(models.dog) ;

      it('DogFormElemns - onlyBelongsTo',async function(){
         let file = await funks.renderTemplate('formElements',modelsObj);
          let created_formElement = file.replace(/\s/g, '');
          let test_formElement = testData.DogFormElem.replace(/\s/g, '');
          expect(created_formElement).to.be.equal(test_formElement);
      });


      let modelsObjProject = funks.fillOptionsForViews(models.project) ;
      it('ProjectFormElemns - hasMany',async function(){
         let file = await funks.renderTemplate('formElements',modelsObjProject);
          let created_formElement = file.replace(/\s/g, '');
          let test_formElement = testData.ProjectForm.replace(/\s/g, '');
          expect(created_formElement).to.be.equal(test_formElement);
      });

      let modelsObjBook = funks.fillOptionsForViews(models.book) ;
      it('BookFormElemns - hasMany',async function(){
         let file = await funks.renderTemplate('formElements',modelsObjBook);
          let created_formElement = file.replace(/\s/g, '');
          let test_formElement = testData.BookForm.replace(/\s/g, '');
          expect(created_formElement).to.be.equal(test_formElement);
      });

      let modelsObjIndividual = funks.fillOptionsForViews(models.individual) ;
      it('individualFormElemns',async function(){
         let file = await funks.renderTemplate('formElements',modelsObjIndividual);
          let created_formElement = file.replace(/\s/g, '');
          let test_formElement = testData.IndividualForm.replace(/\s/g, '');
          expect(created_formElement).to.be.equal(test_formElement);
      });

      let modelsObjTranscript = funks.fillOptionsForViews(models.transcript_count) ;
      it('transcript_countFormElemns',async function(){
         let file = await funks.renderTemplate('formElements',modelsObjTranscript);
          let created_formElement = file.replace(/\s/g, '');
          let test_formElement = testData.TranscriptForm.replace(/\s/g, '');
          expect(created_formElement).to.be.equal(test_formElement);
      });
    });

  describe('CreateForm ', function(){
    let modelsObj = funks.fillOptionsForViews(models.dog) ;
    it('DogCreateForm - onlyBelongsTo',async function(){
       let file = await funks.renderTemplate('createForm',modelsObj);
        let created_formElement = file.replace(/\s/g, '');
        let test_formElement = testData.DogCreateForm.replace(/\s/g, '');
        expect(created_formElement).to.be.equal(test_formElement);
    });

    let modelsObjPerson = funks.fillOptionsForViews(models.person) ;
    it('PersonCreateForm - create with associated items',async function(){
       let file = await funks.renderTemplate('createForm',modelsObjPerson);
        let created_formElement = file.replace(/\s/g, '');
        let test_formElement = testData.PersonCreateForm.replace(/\s/g, '');
        expect(created_formElement).to.be.equal(test_formElement);
    });
  });

  describe('GraphQl Requests ', function(){
    let modelsObj = funks.fillOptionsForViews(models.dog) ;

    it('Add Request - dog',async function(){
       let file = await funks.renderTemplate('graphqlRequests',modelsObj);
        let created_requests = file.replace(/\s/g, '');
        let test_requests = testData.DogRequests.replace(/\s/g, '');
        expect(created_requests).to.be.equal(test_requests);
    });

    let modelsObjPerson = funks.fillOptionsForViews(models.person) ;

    it('Add Request - person',async function(){
       let file = await funks.renderTemplate('graphqlRequests',modelsObjPerson);
        let created_requests = file.replace(/\s/g, '');
        let test_requests = testData.PersonRequests.replace(/\s/g, '');
        expect(created_requests).to.be.equal(test_requests);
    });

    let modelsObjBook = funks.fillOptionsForViews(models.book) ;

    it('update with associated items - book',async function(){
       let file = await funks.renderTemplate('graphqlRequests',modelsObjBook);
        let created_requests = file.replace(/\s/g, '');
        let test_requests = testData.BookRequests.replace(/\s/g, '');
        expect(created_requests).to.be.equal(test_requests);
    });

  });

  describe('EditForm', function(){
    let modelsObj = funks.fillOptionsForViews(models.dog) ;

    it('DogEditForm - onlyBelongsTo',async function(){
       let file = await funks.renderTemplate('editForm',modelsObj);
        let created_editForm = file.replace(/\s/g, '');
        let test_editForm = testData.DogEdit.replace(/\s/g, '');
        expect(created_editForm).to.be.equal(test_editForm);
    });

    let modelsObjBook = funks.fillOptionsForViews(models.book) ;

    it('BookEditForm - update hasMany',async function(){
       let file = await funks.renderTemplate('editForm',modelsObjBook);
        let created_editForm = file.replace(/\s/g, '');
        let test_editForm = testData.BookEdit.replace(/\s/g, '');
        expect(created_editForm).to.be.equal(test_editForm);
    });


  });

  describe('CustomActionsForm', function(){
    let modelsObj = funks.fillOptionsForViews(models.dog) ;

    it('Delete in custom actions - dog',async function(){
       let file = await funks.renderTemplate('customActions',modelsObj);
        let created_customActions = file.replace(/\s/g, '');
        let test_customActions = testData.DogCustomActions.replace(/\s/g, '');
        expect(created_customActions).to.be.equal(test_customActions);
    });
  });

  describe('DetailViewForm', function(){
    let modelsObj = funks.fillOptionsForViews(models.dog) ;
    it('Only belongsTo - dog',async function(){
       let file = await funks.renderTemplate('detailView',modelsObj);
        let created_detailView = file.replace(/\s/g, '');
        let test_detailView = testData.DogDetailView.replace(/\s/g, '');
        expect(created_detailView).to.be.equal(test_detailView);
    });

    let modelsObjProject = funks.fillOptionsForViews(models.project) ;
    it('hasMany - project',async function(){
       let file = await funks.renderTemplate('detailView',modelsObjProject);
        let created_detailView = file.replace(/\s/g, '');
        let test_detailView = testData.projectDetailView.replace(/\s/g, '');
        expect(created_detailView).to.be.equal(test_detailView);
    });

    let modelsObjIndividual = funks.fillOptionsForViews(models.individual) ;
    it('scroll - individual',async function(){
       let file = await funks.renderTemplate('detailView',modelsObjIndividual);
        let created_detailView = file.replace(/\s/g, '');
        let test_detailView = testData.individualDetailView.replace(/\s/g, '');
        expect(created_detailView).to.be.equal(test_detailView);
    });
  });

  describe('UploadForm', function(){
    let modelsObj = funks.fillOptionsForViews(models.dog) ;

    it('UploadForm stream csv - dog',async function(){
       let file = await funks.renderTemplate('uploadCsvForm',modelsObj);
        let created_customActions = file.replace(/\s/g, '');
        let test_customActions = testData.DogUploadFormCsv.replace(/\s/g, '');
        expect(created_customActions).to.be.equal(test_customActions);
    });
  });
