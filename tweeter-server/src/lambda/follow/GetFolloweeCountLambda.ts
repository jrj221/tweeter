import { GetCountRequest, GetCountResponse } from "tweeter-shared";
import { ServerFollowService } from "../../model/service/ServerFollowService";

export const handler = async (request: GetCountRequest): Promise<GetCountResponse> => {
	const followService = new ServerFollowService();

	const count = await followService.getFolloweeCount(
		request.token,
		request.user,
	);

	return {
		success: true,
		message: null,
		count: count,
	};
};
