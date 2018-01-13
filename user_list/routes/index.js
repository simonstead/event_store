const request = require('request');
var express = require('express');
var router = express.Router();

const userList = [];

request
  .post('http://localhost:3000/subscribe', (err, response, body) => {
    if (err) {
      console.log(err);
    } else {
      console.log(body);
    }
  })
  .form({
    eventType: 'register',
    callbackUrl: 'http://localhost:3002/event_list',
  });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: userList });
});

router.post('/event_list', (req, res, next) => {
  userList.push(req.body.username);
  res.json({ status: 'success' });
});

module.exports = router;
