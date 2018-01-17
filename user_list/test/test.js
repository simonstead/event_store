//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should(),
  expect = chai.expect;
chai.use(chaiHttp);

describe('user list', done => {
  const server = require('../app.js');

  after(() => {
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  });

  it('should accept users at /user_list and display them at /', () => {
    const arbitraryEvent = {
      event: 'register',
      username: 'arbitrary username',
      timestamp: new Date().getTime(),
    };

    chai
      .request(server)
      .post('/user_list')
      .send(arbitraryEvent)
      .end((err, res) => {
        res.should.have.status(200);
      });

    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.have.string(arbitraryEvent.username);
      });
  });
});
