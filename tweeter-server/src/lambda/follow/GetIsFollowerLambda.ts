import { IsFollowerRequest, IsFollowerResponse, User } from "tweeter-shared";
import { ServerFollowService } from "../../model/service/ServerFollowService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
	try {
		const followService = new ServerFollowService(new DynamoDBDAOFactory());

		const user = User.fromDTO(request.user);
		const selectedUser = User.fromDTO(request.selectedUser);

		if (!user || !selectedUser) {
			throw new Error("Bad Request: User data is invalid");
		}

		const isFollower = await followService.getIsFollowerStatus(
			request.token,
			user.alias,
			selectedUser.alias,
		);

		return {
			success: true,
			message: null,
			isFollower: isFollower,
		};
	} catch (error) {
		return {
			success: false,
			message: (error as Error).message,
			isFollower: false,
		};
	}
};
