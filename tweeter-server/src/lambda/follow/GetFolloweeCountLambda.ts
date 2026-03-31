import { GetCountRequest, GetCountResponse } from "tweeter-shared";
import { ServerFollowService } from "../../model/service/ServerFollowService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";

export const handler = async (request: GetCountRequest): Promise<GetCountResponse> => {
	try {
		const followService = new ServerFollowService(new DynamoDBDAOFactory());

		const count = await followService.getFolloweeCount(request.token, request.user.alias);

		return {
			success: true,
			message: null,
			count: count,
		};
	} catch (error) {
		return {
			success: false,
			message: (error as Error).message,
			count: 0,
		};
	}
};
