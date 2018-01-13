var redis = require('redis'),
  client = redis.createClient({
    host: 'redis'
  });

client.on('error', function(err) {
  console.log('Error ' + err);
});

// client.rpush('event_store', 'hello', (err, length) => {
//   if (err) {
//     console.log('ERROR WRITING:', err);
//   } else {
//     console.log('LENGTH OF EVENT STORE:', length);
//   }
//   client.lrange('event_store', 0, -1, (err, data) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(data);
//     }
//   });
// });

module.exports = client;
