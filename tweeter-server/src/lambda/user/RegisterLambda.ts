import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { ServerUserService } from "../../model/service/ServerUserService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";

export const handler = async (request: RegisterRequest): Promise<RegisterResponse> => {
	try {
		const userService = new ServerUserService(new DynamoDBDAOFactory());
		const [userDTO, token] = await userService.register(
			request.firstName,
			request.lastName,
			request.alias,
			request.password,
			request.userImageBytes,
			request.imageFileExtension,
		);

		return {
			success: true,
			message: null,
			userDTO: userDTO,
			token: token,
		};
	} catch (error) {
		return {
			success: false,
			message: (error as Error).message,
			userDTO: null,
			token: null,
		};
	}
};
