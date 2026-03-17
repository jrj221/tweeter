import { FollowActionRequest, FollowActionResponse } from "tweeter-shared";
import { ServerFollowService } from "../../model/service/ServerFollowService";

export const handler = async (request: FollowActionRequest): Promise<FollowActionResponse> => {
	const followService = new ServerFollowService();

	const [followerCount, followeeCount] = await followService.unfollow(
		request.token,
		request.targetUser,
	);

	return {
		success: true,
		message: null,
		followerCount,
		followeeCount,
	};
};
