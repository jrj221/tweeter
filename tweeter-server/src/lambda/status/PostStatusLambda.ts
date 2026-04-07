import { PostStatusMessage, PostStatusRequest, PostStatusResponse, Status, StatusDTO } from "tweeter-shared";
import { ServerStatusService } from "../../model/service/ServerStatusService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export const handler = async (request: PostStatusRequest): Promise<PostStatusResponse> => {
	try {
		addStory(request.newStatus, request.token);
		messagePostStatusQueue(request.newStatus.user.alias, request.newStatus);

		return {
			success: true,
			message: null,
		};
	} catch (error) {
		return {
			success: false,
			message: (error as Error).message,
		};
	}
};

async function addStory(newStatusDTO: StatusDTO, token: string) {
	const statusService = new ServerStatusService(new DynamoDBDAOFactory());

	const newStatus = Status.fromDTO(newStatusDTO);

	if (!newStatus) {
		throw new Error("Bad Request: Status data is invalid");
	}

	await statusService.addStory(token, newStatus);
	await messagePostStatusQueue(newStatus.user.alias, newStatusDTO);
}

async function messagePostStatusQueue(followeeAlias: string, statusDTO: StatusDTO) {
	let sqsClient = new SQSClient();

	const sqs_url = "https://sqs.us-east-1.amazonaws.com/735980888276/PostStatus";
	const message: PostStatusMessage = {
		followeeAlias: followeeAlias,
		statusDTO: statusDTO,
	};
	const messageBody = JSON.stringify(message);

	const params = {
		DelaySeconds: 10,
		MessageBody: messageBody,
		QueueUrl: sqs_url,
	};

	try {
		const data = await sqsClient.send(new SendMessageCommand(params));
		console.log("Success, message sent. MessageID:", data.MessageId);
	} catch (err) {
		throw err;
	}
}
