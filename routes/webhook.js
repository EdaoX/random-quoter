// TODO - Move to config
const VERIFICATION_TOKEN = 'ammaccabanane1987';
const PAGE_ACCESS_TOKEN = 'EAAChSJXLa4sBAFc3DMB2HjWBv0ZBkluDSdrwEAscVEDNX5HU5sDVxBIfN7BxNLFI8dDajuTa1qOhYcWTZCFQGessKwwJzkjfO8X8ZCJuBMhjDufSHby7paSjgTRaLTcAv3FOQR0Ups6qPvDHvY39GH54jpqM0e2dIt45agYgjZCkKQR6fUmG';

const express = require('express');
const request = require('request');

const webhook = express();

function callSendAPI(senderPSID, response) {
    // Construct the message body
    let requestBody = {
        "recipient": {
            "id": senderPSID
        },
        "message": response,
        "messaging_type" : "NON_PROMOTIONAL_SUBSCRIPTION"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": requestBody
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });

}

function handleMessage(senderPSID, receivedMessage) {

    let response;

    // Check if the message contains text
    if (receivedMessage.text) {

        // Create the payload for a basic text message
        response = {
            "text": `You sent the message: "${receivedMessage.text}". Now send me an image!`
        }
    }

    // Sends the response message
    callSendAPI(senderPSID, response);
}

webhook.post('/', (req, res) => {

  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

        // Gets the body of the webhook event
        let webhookEvent = entry.messaging[0];
        console.log(webhookEvent);


        // Get the sender PSID
        let senderPSID = webhookEvent.sender.id;
        console.log('Sender PSID: ' + senderPSID);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhookEvent.message) {
            handleMessage(senderPSID, webhookEvent.message);
        } else if (webhookEvent.postback) {
            //handlePostback(sender_psid, webhook_event.postback);
        }

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Adds support for GET requests to our webhook
webhook.get('/', (req, res) => {

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFICATION_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

module.exports = webhook;
