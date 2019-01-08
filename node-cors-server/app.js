/*jslint nodejs: true*/

'use strict';

var fs = require("file-system");
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
    app = express(),
    bodyParser = require('body-parser');


    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

/* -------------------------------------------------------------------------- */

app.get('/get', (req,res) => {
  T.get('search/tweets', {q:'nieuwe', count:2}, function (err, data, response) {
    console.log(data);
    res.json(data);

   });
  console.log('Get 2 tweets');
});

app.post('/post', (req,res) => {
  let content = req.body;
  console.log(content);
  T.post('statuses/update', {status: content.text})
  .then(function (tweet) {
    console.log(tweet);
  })
  .catch(function (error) {
    throw error;
  })
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json());
  console.log('Post tweet');
});

app.post('/postPic', (req,res) => {
  let content = req.body;
  console.log(content);

  var dataUriVar = content.picUrl;
  // remove "data:image/jpeg;base64," from image Data URI.
  var data = dataUriVar.substring(23);

  fs.writeFile("images/outputimage1.png", data, {encoding: 'base64'}, function(err) {
    if (err) {
      console.log(err)
    }
  });

  var b64content = fs.readFileSync("images/outputimage1.png", { encoding: 'base64' })

    // first we must post the media to Twitter
    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      var mediaIdStr = data.media_id_string
      var altText = content.picAlt
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

      T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
          // now we can reference the media and post a tweet (media will attach to the tweet)
          var params = { status: content.text, media_ids: [mediaIdStr] }

          T.post('statuses/update', params, function (err, data, response) {
            console.log(data)
          })
        }
      })
    })
  .catch(function (error) {
    console.log(error);
    throw error;
  })
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json());
  console.log('Post tweet with pic');
});

/* -------------------------------------------------------------------------- */

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
