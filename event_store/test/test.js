//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

const redis = require('../redisClient');
redis.select(1, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected to test database');
  }
});
redis.flushdb();

describe('event store', done => {
  const server = require('../app.js');
  it('should not bork', () => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
      });
  });

  it('can register subscribers', done => {
    const arbitraryEventType = 'register';
    const arbitraryCallbackUrl = 'http://www.fake.com';
    chai
      .request(server)
      .post('/subscribe')
      .send({
        eventType: arbitraryEventType,
        callbackUrl: arbitraryCallbackUrl,
      })
      .end((err, res) => {
        res.body.msg.should.equal(`SUBSCRIBED TO /${arbitraryEventType}`);

        redis.sismember(
          `subscriptions:${arbitraryEventType}`,
          arbitraryCallbackUrl,
          (err, data) => {
            if (err) {
              done(err);
            } else {
              data.should.equal(1);
              done();
            }
          },
        );
      });
  });
});
