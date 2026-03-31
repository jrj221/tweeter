import { LoginRequest, LoginResponse } from "tweeter-shared";
import { ServerUserService } from "../../model/service/ServerUserService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";

export const handler = async (request: LoginRequest): Promise<LoginResponse> => {
	try {
		const userService = new ServerUserService(new DynamoDBDAOFactory());
		const [user, token] = await userService.login(request.alias, request.password);

		return { success: true, message: null, userDTO: user, token: token };
	} catch (error) {
		return { success: false, message: (error as Error).message, userDTO: null, token: null };
	}
};
