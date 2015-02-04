var expect = require('chai').expect;

var amqp = require('amqp');

var pubsub = require('../');

describe('pubsub', function() {
  this.timeout(5000);

  it('should create a new pubsub client', function() {
    var connection = amqp.createConnection({ host: "localhost" });

    var pubsubClient = pubsub(connection, 'test-pubsub-client');

    expect(pubsubClient).to.exist;
  });

  it('should publish messages', function(done) {
    var subscriberConn = amqp.createConnection({ host: "localhost" });

    subscriberConn.on('ready', function() {
      var subscriber = pubsub(subscriberConn, 'test-pubsub-publish');
      subscriber.subscribe(function(message) {
        expect(message).to.deep.equal({ test : 'hello world'});

        done();
      });

      var publisherConn = amqp.createConnection({ host: "localhost" });
      publisherConn.on('ready', function() {
        var publisher = pubsub(publisherConn, 'test-pubsub-publish');
        publisher.publish({ test : 'hello world'});
      });
    });
  });
});