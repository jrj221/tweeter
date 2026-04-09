"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSQSMessage = sendSQSMessage;
exports.sendSQSMessageBatch = sendSQSMessageBatch;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const sqsClient = new client_sqs_1.SQSClient();
async function sendSQSMessage(sqsURL, message) {
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
async function sendSQSMessageBatch(sqsURL, messages) {
    const params = {
        QueueUrl: sqsURL,
        Entries: messages.map((message, index) => ({
            Id: index.toString(),
            MessageBody: JSON.stringify(message),
            DelaySeconds: 10,
        })),
    };
    try {
        const data = await sqsClient.send(new client_sqs_1.SendMessageBatchCommand(params));
        console.log("Success, message batch sent. Successful:", data.Successful?.length);
        if (data.Failed && data.Failed.length > 0) {
            console.error("Some messages in batch failed:", data.Failed);
        }
    }
    catch (err) {
        throw err;
    }
}
