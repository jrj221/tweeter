import { AuthToken, PostStatusRequest, PostStatusResponse, Status } from "tweeter-shared";
import { ServerStatusService } from "../../model/service/ServerStatusService";

export const handler = async (request: PostStatusRequest): Promise<PostStatusResponse> => {
	const statusService = new ServerStatusService();

	const newStatus = Status.fromDTO(request.newStatus);

	if (!newStatus) {
		throw new Error("Bad Request: Status data is invalid");
	}

	await statusService.postStatus(request.token, newStatus);

	return {
		success: true,
		message: null,
	};
};
