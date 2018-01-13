const request = require('request');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Register a user' });
});

router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const eventRequest = {
    eventType: 'register',
    username: username
  };
  request
    .post('http://event-store:3000/events', (err, response, body) => {
      if (err) {
        console.log(err);
      }
      res.render('index', { title: 'Your sign up is being processed' });
    })
    .form(eventRequest);
});

module.exports = router;
