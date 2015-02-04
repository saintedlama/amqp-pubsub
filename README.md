# amqp-pubsub
Minimalist abstraction layer for amqp publish/subscribe implementations

## Installation

```
npm install amqp-pubsub
```

## Usage

Publisher

```javascript
var amqp = require('amqp');
var pubsub = require('amqp-pubsub');

var connection = amqp.createConnection({ host: "localhost" });

connection.on('ready', function() {
  var pubsubClient = pubsub(connection, 'amqp-pubsub-example');
  pubsubClient.publish({ test : 'hello world'});
});

```

Subscriber

```javascript
var amqp = require('amqp');
var pubsub = require('../');

var connection = amqp.createConnection({ host: "localhost" });

connection.on('ready', function() {
  var pubsubClient = pubsub(connection, 'amqp-pubsub-example');

  pubsubClient.subscribe(function(message) {
    console.log(message);
  });
});

```