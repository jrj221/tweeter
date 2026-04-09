import { PostStatusRequest, PostStatusResponse, Status, StatusDTO } from "tweeter-shared";
import { ServerStatusService } from "../../model/service/ServerStatusService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";
import { sendSQSMessage } from "./MessageQueue";
import { PostStatusMessage } from "tweeter-shared";

export const handler = async (request: PostStatusRequest): Promise<PostStatusResponse> => {
	try {
		await addStory(request.newStatus, request.token);

		const message: PostStatusMessage = {
			followeeAlias: request.newStatus.user.alias,
			statusDTO: request.newStatus,
			token: request.token,
		};
		await sendSQSMessage("https://sqs.us-east-1.amazonaws.com/735980888276/PostStatus", message);

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
}
