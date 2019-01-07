/*jslint nodejs: true*/

'use strict';

var Twit = require('twit');

var T = new Twit({
  consumer_key:         'RUvKdeluIFWKbCksmZyPd2ofL',
  consumer_secret:      '9lJ4X3u7qPQjRmeMQnvBtd2j9b2qeFzNZppF5UuD5CDTBxKxzo',
  access_token:         '1077614313081372673-fX3RjPjRMg7GSNC5YYO6Mk9xwDPRG8',
  access_token_secret:  'NBFeLOiImmQXHczcPi9B6uo7FNwFCXPUrIr54u9zInJea'
});

var express = require('express'),
    cors = require('cors'),
    port = process.env.PORT || 5000,
    app = express();

/* -------------------------------------------------------------------------- */

app.get('/get', (req,res) => {
  var datavar;
  T.get('search/tweets', {q:'nieuwe', count:2}, function (err, data, response) {
    console.log(data);
    res.json(data);

   });
  console.log('Sent list of items');
});

app.get('/no-cors', (req, res) => {
  res.json({
    text: 'You should not see this via a CORS request.'
  });
  console.log('No cors');
});

/* -------------------------------------------------------------------------- */

app.get('/simple-cors', cors(), function(req, res){
  res.json({
    text: 'Simple CORS requests are working. [GET]'
  });
});
app.head('/simple-cors', cors(), function(req, res){
  res.send(204);
});
app.post('/simple-cors', cors(), function(req, res){
  res.json({
    text: 'Simple CORS requests are working. [POST]'
  });
});

/* -------------------------------------------------------------------------- */

app.options('/complex-cors', cors());
app.del('/complex-cors', cors(), function(req, res){
  res.json({
    text: 'Complex CORS requests are working. [DELETE]'
  });
});

/* -------------------------------------------------------------------------- */

var issue2options = {
  origin: true,
  methods: ['POST'],
  credentials: true,
  maxAge: 3600
};
app.options('/issue-2', cors(issue2options));
app.post('/issue-2', cors(issue2options), function(req, res){
  res.json({
    text: 'Issue #2 is fixed.'
  });
});

if(!module.parent){
  app.listen(port, function(){
    console.log('Express server listening on port ' + port + '.');
  });
}
