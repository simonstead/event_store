const request = require('request');
var express = require('express');
var router = express.Router();

const userList = [];

const subscribeToStore = () =>
  request
    .post('http://event-store:3000/subscribe', (err, response, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log('SUBSCRIBED TO STORE');
        const data = JSON.parse(body)['data'];
        if (!data || data.length === 0) {
          console.log('WARNING NO DATA RECEIVED');
        }
        const dataItems = data.map(item => JSON.parse(item));
        userList.push(...dataItems);
      }
    })
    .form({
      eventType: 'register',
      callbackUrl: 'http://user-list:3002/user_list'
    });

subscribeToStore();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { users: userList });
});

router.post('/user_list', (req, res, next) => {
  console.log('USER RECEIVED', req.body);
  userList.push(req.body);
  res.json({ status: 'success' });
});

module.exports = router;
