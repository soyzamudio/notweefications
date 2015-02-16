var MongoClient = require('mongodb').MongoClient
, assert = require('assert');
var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun(process.env.MG_KEY);

var url = process.env.MONGO_URL;

var handleTweets = function(tweets) {
  var emailBody = '';
  var tweetsTexts = tweets.map(function(tweet) {
    return tweetText(tweet) + ' | ' + tweetUrl(tweet);
  }).join('\n');
  return tweetsTexts;
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server\n");

  var collection = db.collection('documents');
  collection.find({}).toArray(function(err, tweets) {
    assert.equal(err, null);
    sendMail("You've got" + tweets.length + 'tweets', handleTweets(tweets));
    db.close();
  });

});

function tweetText(tweet) {
  return '@' + tweet.user.screen_name + ': ' + tweet.text;
}

function tweetUrl(tweet) {
  return 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
}

var sendMail = function(subject, message) {
  mg.sendText('zamudio@outlook.com', 'Jose Zamudio <jose@josezamudio.me>', subject, message, function(err) {
    err ? console.log('Oh noes: ' + err) : console.log('Success');
  });
}
