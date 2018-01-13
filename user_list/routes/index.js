const request = require('request');
var express = require('express');
var router = express.Router();

const userList = [];

request
  .post('http://event_store:3000/subscribe', (err, response, body) => {
    if (err) {
      console.log(err);
    } else {
      console.log(body);
    }
  })
  .form({
    eventType: 'register',
    callbackUrl: 'http://user_list:3002/user_list',
  });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: userList });
});

router.post('/user_list', (req, res, next) => {
  console.log('USER RECEIVED', req.body);
  userList.push(req.body.username);
  res.json({ status: 'success' });
});

module.exports = router;
