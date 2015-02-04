"use strict";
var AWS = require('aws-sdk'),
        awsRegion = 'eu-west-1',
        sqs = {},
        Hapi = require('hapi');

// Read the credentials from ~/.aws/credentials
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

var server = new Hapi.Server();
server.connection({ port: process.env.PORT || 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

function sendSqsMessage(param) {
    AWS.config.update({region: awsRegion});
    sqs = new AWS.SQS();

    var params = {
        MessageBody: param,
        QueueUrl: 'https://sqs.eu-west-1.amazonaws.com/929063684942/job-test-to-denis',
        DelaySeconds: 0
    };

    sqs.sendMessage(params, function(err) {
        if (err) {
            console.log(err, err.stack);
        } // an error occurred
        else {
            console.log('Victory, message sent for ' + param + '!');
        }
    });
}

server.route({
    method: 'POST',
    path: '/send',
    handler: function (request, reply) {
        var param = JSON.stringify(request.payload);
        sendSqsMessage(param);
        reply('Your message ' + param + ' has been sent to queue!');
    }
});

var logOptions = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        args:[{ log: '*', response: '*' }]
    }]
};

server.register({
    register: require('good'),
    options: logOptions
}, function (err) {
    if (err) {
        console.error(err);
    } else {
        server.start(function () {
            console.info('Server started at ' + server.info.uri);
        });
    }
});
