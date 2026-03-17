import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { ServerUserService } from "../../model/service/ServerUserService";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
	const userService = new ServerUserService();
	const user = await userService.getUser(request.token, request.alias);
	return { success: true, message: null, user: user };
};
