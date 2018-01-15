const request = require('request');
const express = require('express');
const router = express.Router();

const redisClient = require('../redisClient');
const EVENT_STORE = 'event_store';

redisClient.scan(0, 'MATCH', 'event*', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Store' });
});

router.post('/events', (req, res, next) => {
  console.log('EVENT RECEIVED', req.body.eventType);
  const timestamp = new Date().getTime();
  const event = { ...req.body, timestamp: timestamp };
  const { eventType, username } = req.body;

  // maybe we have a list of 'eventType:timestamp' which we push to,
  // then a bunch of hashest with 'streamId:timestamp' as their key?
  // maybe also a sorted set of streamIds

  // sadd 'streams' : '1'
  // lpush 'event_store' : 'register:1515926279094'
  // hmset '1:1515926279094' username 'Finn the Human'
  §

  redisClient.lpush(EVENT_STORE, JSON.stringify(event), (err, len) => {
    if (err) {
      console.error(err);
    } else {
      redisClient.lrange(EVENT_STORE, 0, -1, (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`---\n---\n ${data} \n---\n---`);
        }
      });
    }
  });

  redisClient.smembers(`subscriptions:${eventType}`, (err, endpoints) => {
    if (err) {
      console.error(err);
    } else {
      endpoints.forEach(endpoint => {
        console.log('STARTING_POST to', endpoint);
        request
          .post(endpoint, (err, response, body) => {
            console.log('MESSAGE BROADCASTED:', event);
          })
          .form(event);
      });
    }
  });

  res.json({ status: 'success' });
});

// { eventType: "register", callbackUrl: "http://localhost:3002/user_list"}
router.post('/subscribe', (req, res, next) => {
  const eventType = req.body.eventType;
  const callbackUrl = req.body.callbackUrl;

  redisClient.sadd(`subscriptions:${eventType}`, callbackUrl, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log('NEW SUBSCRIBER TO', eventType);
    }
  });

  redisClient.lrange(EVENT_STORE, 0, -1, (err, data) => {
    if (err) {
      console.error(err);
      res.json({
        msg: `SUBSCRIBED TO /${eventType}`,
        err: 'Could not get seed data'
      });
    } else {
      res.json({
        msg: `SUBSCRIBED TO /${eventType}`,
        data: data
      });
    }
  });
});

module.exports = router;
