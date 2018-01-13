const request = require('request');
const express = require('express');
const router = express.Router();

const subscriptions = {};
const eventStore = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Store' });
});

router.post('/events', (req, res, next) => {
  console.log('EVENT RECEIVED', req.body.eventType);
  console.log(subscriptions);
  const event = req.body;
  const { eventType, username } = event;

  eventStore.push({ ...event, timestamp: new Date() });
  console.log(eventStore);

  if (subscriptions[eventType]) {
    subscriptions[eventType].forEach(endpoint => {
      console.log(endpoint);
      console.log('STARTING_POST');
      request
        .post(endpoint, (err, response, body) => {
          console.log('MESSAGE BROADCASTED:', event);
        })
        .form(event);
    });
  }

  res.json({ status: 'success' });
});

// { eventType: "register", callbackUrl: "http://localhost:3002/event_list"}
router.post('/subscribe', (req, res, next) => {
  const eventType = req.body.eventType;
  const callbackUrl = req.body.callbackUrl;

  if (!subscriptions[eventType]) {
    subscriptions[eventType] = [callbackUrl];
  } else if (subscriptions[eventType].indexOf(callbackUrl) === -1) {
    subscriptions[eventType].push(callbackUrl);
  }

  console.log(subscriptions);

  res.json({ msg: `SUBSCRIBED TO /${eventType}` });
});

module.exports = router;
