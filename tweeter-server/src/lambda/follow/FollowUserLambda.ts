import { FollowActionRequest, FollowActionResponse } from "tweeter-shared";
import { ServerFollowService } from "../../model/service/ServerFollowService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";

export const handler = async (request: FollowActionRequest): Promise<FollowActionResponse> => {
	const followService = new ServerFollowService(new DynamoDBDAOFactory());

	const [followerCount, followeeCount] = await followService.follow(
		request.token,
		request.user.alias,
		request.targetUser.alias,
	);

	return {
		success: true,
		message: null,
		followerCount,
		followeeCount,
	};
};
