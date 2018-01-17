//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should(),
  expect = chai.expect;
chai.use(chaiHttp);

describe('register', done => {
  const server = require('../app.js');

  after(() => {
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  });

  it('should respond to /', () => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
      });
  });

  it('should register users', done => {
    chai
      .request(server)
      .post('/register')
      .send({
        username: 'arbitrary username',
      })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
