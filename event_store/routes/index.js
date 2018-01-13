const request = require('request');
const express = require('express');
const router = express.Router();

const redisClient = require('../redisClient');
const subscriptions = {};
const EVENT_STORE = 'event-store';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Store' });
});

router.post('/events', (req, res, next) => {
  console.log('EVENT RECEIVED', req.body.eventType);
  console.log(subscriptions);
  const event = { ...req.body, timestamp: new Date() };
  const { eventType, username } = req.body;

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

  if (subscriptions[eventType]) {
    subscriptions[eventType].forEach(endpoint => {
      console.log('STARTING_POST to', endpoint);
      request
        .post(endpoint, (err, response, body) => {
          console.log('MESSAGE BROADCASTED:', event);
        })
        .form(event);
    });
  }

  res.json({ status: 'success' });
});

// { eventType: "register", callbackUrl: "http://localhost:3002/user_list"}
router.post('/subscribe', (req, res, next) => {
  const eventType = req.body.eventType;
  const callbackUrl = req.body.callbackUrl;

  if (!subscriptions[eventType]) {
    subscriptions[eventType] = [callbackUrl];
  } else if (subscriptions[eventType].indexOf(callbackUrl) === -1) {
    subscriptions[eventType].push(callbackUrl);
  }

  console.log(subscriptions);

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
