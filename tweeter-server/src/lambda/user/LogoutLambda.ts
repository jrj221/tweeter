import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { ServerUserService } from "../../model/service/ServerUserService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";

export const handler = async (request: LogoutRequest): Promise<LogoutResponse> => {
	try {
		const userService = new ServerUserService(new DynamoDBDAOFactory());
		await userService.logout(request.token);

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
