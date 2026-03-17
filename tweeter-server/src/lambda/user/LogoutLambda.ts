import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { ServerUserService } from "../../model/service/ServerUserService";

export const handler = async (request: LogoutRequest): Promise<LogoutResponse> => {
	const userService = new ServerUserService();

	await userService.logout(request.token);

	return {
		success: true,
		message: null,
	};
};
