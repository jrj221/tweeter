import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { ServerUserService } from "../../model/service/ServerUserService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
	const userService = new ServerUserService(new DynamoDBDAOFactory());
	const userDTO = await userService.getUser(request.token, request.alias);
	return { success: true, message: null, userDTO: userDTO };
};
