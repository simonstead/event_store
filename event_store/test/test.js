//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should(),
  expect = chai.expect;
chai.use(chaiHttp);

const redis = require('../redis/redisClient');

describe('event store', done => {
  const server = require('../app.js');

  before(() => {
    redis.select(1, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Connected to test database');
      }
    });
  });

  after(() => {
    redis.flushdb();
    redis.quit();
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

  it('can register subscribers', done => {
    const arbitraryEventType = 'register',
      arbitraryCallbackUrl = 'http://www.fake.com';
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
            expect(err).to.be.null;
            data.should.equal(1);
            done();
          },
        );
      });
  });

  it('should accept events', done => {
    const arbitraryEventType = 'register',
      arbitraryUsername = 'Finn the Human';
    chai
      .request(server)
      .post('/events')
      .send({
        eventType: arbitraryEventType,
        username: arbitraryUsername,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        redis.lrange(`event_store`, 0, -1, (err, data) => {
          expect(err).to.be.null;
          data.should.be.an('array');
          data.length.should.equal(1);

          const e = JSON.parse(data[0]);
          e.eventType.should.equal(arbitraryEventType);
          e.username.should.equal(arbitraryUsername);
          e.timestamp.should.be.at.least(0);
          done();
        });
      });
  });
});
