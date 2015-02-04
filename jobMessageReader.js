"use strict";
var AWS = require('aws-sdk'),
        awsRegion = 'eu-west-1',
        sqs = {},
        Hapi = require('hapi');

// Read the credentials from ~/.aws/credentials
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

function isMessage(data) {
    return data && data.Messages && typeof data.Messages[0] !== 'undefined' && typeof data.Messages[0].Body !== 'undefined';
}

function readSqsMessage() {
    AWS.config.update({region: awsRegion});
    sqs = new AWS.SQS();

    var params = {
        QueueUrl: 'https://sqs.eu-west-1.amazonaws.com/929063684942/job-test-to-denis',
        "MaxNumberOfMessages": 1,
        "VisibilityTimeout": 30,
        "WaitTimeSeconds": 20
    };

    sqs.receiveMessage(params, function (err, data) {
        var sqs_message_body;
        if (isMessage(data)) {
            //sqs msg body
            try {
                sqs_message_body = JSON.parse(data.Messages[0].Body);
                // This is where we'd post it to the gateway
                console.log("SQS Message read");
                console.log(JSON.stringify(sqs_message_body));
            } catch (e) {
                console.log("Unable to parse message: " + e.message);
            }
        }
    });
}

readSqsMessage();