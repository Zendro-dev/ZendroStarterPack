var server = require('../server');
const request = require('supertest');
const test = require('./test-data');

const chai = require('chai');
const expect = chai.expect;

describe('Testing Queries Server GraphQL', ()=>{
    it('Read all - people', (done)=>{
        request(server).post('/graphql')
            .send({query: '{people{ firstName lastName email}}'})
            .expect(200).end((err,res)=>{
            if(err){
                console.log(err);
                done(err);
            }
            expect(res.body.data.people).to.deep.equal(test.people);
            done();
        });

    });

    it('Search with filter - people by email', (done)=>{
        request(server).post('/graphql')
            .send({query: '{ searchPerson(input:{field:email, value:{value:"%art%"}, operator:like}){ firstName lastName}}'})
            .expect(200).end((err,res)=>{
            if(err){
                console.log(err);
                done(err);
            }
            expect(res.body.data.searchPerson).to.deep.equal(test.searchPeopleByEmail);
            done();
        });

    });

    it('Read one by Id - books', (done)=>{
        request(server).post('/graphql')
            .send({query: '{readOneBook(id:3){title}}'})
            .expect(200).end((err,res)=>{
            if(err){
                console.log(err);
                done(err);
            }
            expect(res.body.data.readOneBook).to.deep.equal(test.readOneBook);
            done();
        });
    });
});

describe('Testing Mutations Server GraphQL', ()=>{
    it('Create one - dogs', (done)=>{
        request(server).post('/graphql')
            .send({query: 'mutation{addDog(name:"toto", breed:"chihuahua"){name breed}}'})
            .expect(200).end((err,res)=>{
            if(err){
                console.log(err);
                done(err);
            }
            expect(res.body.data.addDog).to.deep.equal(test.addDog);
            done();
        });
    });

    it('Delete one - dogs', (done)=>{
        request(server).post('/graphql')
            .send({query: 'mutation{deleteDog(id:6)}'})
            .expect(200).end((err,res)=>{
            if(err){
                console.log(err);
                done(err);
            }
            expect(res.body.data.deleteDog).to.deep.equal(test.deleteDog);
            done();
        });
    });

    it('Update one - books', (done)=>{
        request(server).post('/graphql')
            .send({query: 'mutation{updateBook(id:2, title:"Paintings II"){title genre}}'})
            .expect(200).end((err,res)=>{
            if(err){
                console.log(err);
                done(err);
            }
            expect(res.body.data.updateBook).to.deep.equal(test.updateBook);
            done();
        });
    });


});




server.close();