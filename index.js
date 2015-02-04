var amqp = require('amqp');
var debug = require('debug')('amqp:pubsub');

var PubSub = function(connection, exchangeName) {
  this.connection = connection;
  this.exchangeName = exchangeName;
};

PubSub.prototype.publish = function(message) {
  var self = this;

  self.connection.exchange(self.exchangeName, { type:'fanout', durable : true, autoDelete :false }, function(exchange) {
    debug('PubSub exchange "%s" established for publish', self.exchangeName);

    exchange.publish('', JSON.stringify(message), {});

    debug('Published message to exchange %s', self.exchangeName);
  });
};

PubSub.prototype.subscribe = function(subscriber) {
  var self = this;

  self.connection.exchange(self.exchangeName, { type:'fanout', durable : true, autoDelete :false }, function(exchange) {
    debug('PubSub exchange "%s" established for subscribe', self.exchangeName);

    self.connection.queue('', function(queue) {
      debug('Created subscriber queue for exchange "%s"', self.exchangeName);

      queue.bind(exchange, '');
      queue.subscribe(function (message) {
        var msg = JSON.parse(message.data);

        debug('Received message "%j" via exchange %s. Delegating parsed JSON to receiver', msg, self.exchangeName);
        subscriber(msg);
      });
    });
  });
};


module.exports = function(connection, exchange) {
  return new PubSub(connection, exchange);
};