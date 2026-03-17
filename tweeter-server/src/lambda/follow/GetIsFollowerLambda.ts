import { IsFollowerRequest, IsFollowerResponse, User } from "tweeter-shared";
import { ServerFollowService } from "../../model/service/ServerFollowService";

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
	const followService = new ServerFollowService();

	const user = User.fromDTO(request.user);
	const selectedUser = User.fromDTO(request.selectedUser);

	if (!user || !selectedUser) {
		throw new Error("Bad Request: User data is invalid");
	}

	const isFollower = await followService.getIsFollowerStatus(
		{ token: request.token, timestamp: Date.now() } as any,
		user,
		selectedUser,
	);

	return {
		success: true,
		message: null,
		isFollower: isFollower,
	};
};
