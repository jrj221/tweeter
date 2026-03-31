import { AuthToken, PostStatusRequest, PostStatusResponse, Status } from "tweeter-shared";
import { ServerStatusService } from "../../model/service/ServerStatusService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";

export const handler = async (request: PostStatusRequest): Promise<PostStatusResponse> => {
	try {
		const statusService = new ServerStatusService(new DynamoDBDAOFactory());

		const newStatus = Status.fromDTO(request.newStatus);

		if (!newStatus) {
			throw new Error("Bad Request: Status data is invalid");
		}

		await statusService.postStatus(request.token, newStatus);

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
