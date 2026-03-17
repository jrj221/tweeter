import { LoginRequest, LoginResponse } from "tweeter-shared";
import { ServerUserService } from "../../model/service/ServerUserService";

export const handler = async (request: LoginRequest): Promise<LoginResponse> => {
	const userService = new ServerUserService();
	const [user, token] = await userService.login(request.alias, request.password);

	return { success: true, message: null, userDTO: user, token: token };
};
