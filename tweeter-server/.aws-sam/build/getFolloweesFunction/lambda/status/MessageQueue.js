"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSQSMessage = sendSQSMessage;
const client_sqs_1 = require("@aws-sdk/client-sqs");
// Where is the best spot for this function to be stored?
async function sendSQSMessage(sqsURL, message) {
    let sqsClient = new client_sqs_1.SQSClient();
    const messageBody = JSON.stringify(message);
    const params = {
        DelaySeconds: 10,
        MessageBody: messageBody,
        QueueUrl: sqsURL,
    };
    try {
        const data = await sqsClient.send(new client_sqs_1.SendMessageCommand(params));
        console.log("Success, message sent. MessageID:", data.MessageId);
    }
    catch (err) {
        throw err;
    }
}
