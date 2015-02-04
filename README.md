# sqs-nodejs-poster

Sample code for posting to an SQS queue using Node.js. The `server.js` provides a very simple web server which allows you to
POST JSON messages which then get added to your SQS queue, and `jobMessageReader.js` can be run to read the first message
from the queue and parse the JSON content.

To use this, clone the repository, then to install the npm packages:
```
npm install
```
Next you need to create your queue in SQS (don't forget to assign permissions) and then update 
the `aws-config.js` file to have your queue url and region.

You can check if everything is OK by running the tests using `mocha` (which by default will run all the javascript files in the 
`tests` directory:
```
mocha
```
Unless you've already set up your AWS credentials, the chances are that the tests will fail. In which case, create
yourself a `~/.aws/credentials` file and put the following in it:
```
[default]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY
```
Once the tests are passing you should be able to run the server:
```
node server.js
```
This will continue to run in the background (and generate server logs to the console). You can check it using
```
curl  http://127.0.0.1:3000/
```
You should get a message such as `send a POST to /send and add some JSON as the payload`. In order to do this, create a
valid JSON file (anything will do) and save it in the root directory. You can now put it on your queue as follows:
```
curl -d @data.json http://127.0.0.1:3000/
```
If all goes well, you should get an initial response back from the server, and in the server logs it will report if it was
able to add the message to the SQS queue. You can also check this by going to your AWS SQS console. In the list of queues,
your queue should have one message.

You can now read this message using:
```
node jobMessageReader.js
```
This connects to the queue and reads the first message (NB it doesn't delete it yet) and outputs it to the console.
