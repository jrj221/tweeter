import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { SQSMessage } from "tweeter-shared";

// Where is the best spot for this function to be stored?

export async function sendSQSMessage(sqsURL: string, message: SQSMessage) {
	let sqsClient = new SQSClient();

	const messageBody = JSON.stringify(message);

	const params = {
		DelaySeconds: 10,
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
