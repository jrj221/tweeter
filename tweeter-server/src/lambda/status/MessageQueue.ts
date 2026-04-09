import { SQSClient, SendMessageCommand, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { SQSMessage } from "tweeter-shared";

const sqsClient = new SQSClient();

export async function sendSQSMessage(sqsURL: string, message: SQSMessage) {
	const messageBody = JSON.stringify(message);

	const params = {
		DelaySeconds: 0, // Changed from 10
		MessageBody: messageBody,
		QueueUrl: sqsURL,
	};

	try {
		const data = await sqsClient.send(new SendMessageCommand(params));
		console.log("Success, message sent. MessageID:", data.MessageId);
	} catch (err) {
		throw err;
	}
}

export async function sendSQSMessageBatch(sqsURL: string, messages: SQSMessage[]) {
	const params = {
		QueueUrl: sqsURL,
		Entries: messages.map((message, index) => ({
			Id: index.toString(),
			MessageBody: JSON.stringify(message),
			DelaySeconds: 0, // Changed from 10
		})),
	};

	try {
		const data = await sqsClient.send(new SendMessageBatchCommand(params));
		console.log("Success, message batch sent. Successful:", data.Successful?.length);
		if (data.Failed && data.Failed.length > 0) {
			console.error("Some messages in batch failed:", data.Failed);
		}
	} catch (err) {
		throw err;
	}
}
