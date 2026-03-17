import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { ServerUserService } from "../../model/service/ServerUserService";

export const handler = async (request: RegisterRequest): Promise<RegisterResponse> => {
	const userService = new ServerUserService();
	const [userDTO, token] = await userService.register(
		request.firstName,
		request.lastName,
		request.alias,
		request.password,
		Buffer.from(request.userImageBytes, "base64"),
		request.imageFileExtension,
	);

	return {
		success: true,
		message: null,
		userDTO: userDTO,
		token: token,
	};
};
