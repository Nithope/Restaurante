process.env.JWT_KEY = "w0l0lO"
const app = require('../app');
const request = require('supertest')(app);
const cpf_cnpj = require("cpf_cnpj").CNPJ;
const faker = require("faker");

faker.locale = "pt_BR";

var auth = {};
var usersData = {
    email: faker.internet.email(),
    password: faker.random.number().toString()
}
var specialty = {
    enum: ['Pizzaria','Arabe','Brasileira','Lanchonete','Outros'],
}

describe('POST /users/signup - Create a User', ()=> {
    it('should respond with User Created',done =>{
        request
        .post('/users/signup')
        .send({
            email: usersData.email,
            password: usersData.password
        })
        .expect(201)
        .end((err,res)=>{
            if(err) return done(err);
            done();
            //console.log(res.body);
        })
    });
}); 

describe('POST /users/login - Create a User', function() {
    it('should respond with Auth Successful',function (done){
        request
        .post('/users/login')
        .send({
            email: usersData.email,
            password: usersData.password
        })
        .expect(200)
        .end((err,res)=>{
            if(err) return done(err);
            auth.token = res.body.token;
            done();
            //console.log(res.body);
        })
    });
}); 

describe('POST /restaurantes/ - Create a Restaurante', function () {
    let randomSpecialty = Math.floor(Math.random()*specialty.enum.length)
    it('should respond with Restaurante Created', function (done) {
        request
            .post('/restaurantes/')
            .set('Authorization', 'bearer ' + auth.token)
            .send({
                name: faker.company.companyName(),
                phone: faker.phone.phoneNumber(),
                cnpj: cpf_cnpj.generate(true),
                specialty: specialty.enum[randomSpecialty]
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                done();
                //console.log(res.body);
            });
    });
});

describe('PUT /restaurantes/ - Update a Restaurante', function () {
    let randomSpecialty = Math.floor(Math.random()*specialty.enum.length)
    it('should respond with Restaurante Updated', function (done) {
        
        request
            .get('/restaurantes/')
            .set('Authorization', 'bearer ' + auth.token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                let random = Math.floor(Math.random()*res.body.restaurantes.length)
                //console.log(res.body.restaurantes[random]);
                request
                .put('/restaurantes/')
                .set('Authorization', 'bearer ' + auth.token)
                .send({
                    id: res.body.restaurantes[random]._id,
                    name: faker.company.companyName(),
                    phone: faker.phone.phoneNumber(),
                    cnpj: cpf_cnpj.generate(true),
                    specialty: specialty.enum[randomSpecialty]
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
            });
    });
});

describe('DELETE /restaurantes/ - Delete a Restaurante', function () {

    it('should respond with Restaurante Deleted', function (done) {
        
        request
            .get('/restaurantes/')
            .set('Authorization', 'bearer ' + auth.token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                let random = Math.floor(Math.random()*res.body.restaurantes.length)
                //console.log(res.body.restaurantes[random]);
                request
                .delete('/restaurantes/'+ res.body.restaurantes[random]._id)
                .set('Authorization', 'bearer ' + auth.token)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);
                    //console.log(res.body);
                    done();
                });
            });
    });
});

describe('GET /restaurantes/ - Get all registered Restaurantes', function () {

    it('should respond with Restaurantes', function (done) {
        request
            .get('/restaurantes/')
            .set('Authorization', 'bearer ' + auth.token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                done();
                //console.log(res.body.restaurantes);
            });
    });
});