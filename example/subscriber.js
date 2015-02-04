var amqp = require('amqp');
var pubsub = require('../');

var connection = amqp.createConnection({ host: "localhost" });

connection.on('ready', function() {
  var pubsubClient = pubsub(connection, 'amqp-pubsub-example');

  pubsubClient.subscribe(function(message) {
    console.log('Received message', message);
  });
});