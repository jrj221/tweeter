import { Buffer } from "buffer";
import { FakeData, UserDTO, MAX_AUTH_TIME } from "tweeter-shared";
import { Service } from "./Service";

export class ServerUserService extends Service {
	public async getUser(token: string, alias: string): Promise<UserDTO | null> {
		await this.doAuthenticate(token);
		const userDAO = this._daoFactory.makeUserDAO();
		return await userDAO.findUserByAlias(alias);
	}

	public async logout(token: string): Promise<void> {
		await this.doAuthenticate(token);
		const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
		await authTokenDAO.removeAuthToken(token);
	}

	public async login(alias: string, password: string): Promise<[UserDTO, string]> {
		const userDAO = this._daoFactory.makeUserDAO();
		const user = await userDAO.findUserByAlias(alias);

		if (user === null) {
			throw new Error("Invalid alias or password"); // Real password check would go here
		}

		const authToken = FakeData.instance.authToken.token; // hardcode for now
		const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
		await authTokenDAO.addAuthToken(authToken, alias, Date.now() + MAX_AUTH_TIME); 

		return [user, authToken];
	}

	public async register(
		firstName: string,
		lastName: string,
		alias: string,
		password: string,
		userImageBytes: Uint8Array,
		imageFileExtension: string,
	): Promise<[UserDTO, string]> {
		const userDAO = this._daoFactory.makeUserDAO();
		
		// In a real app, we would upload the image to S3 here and get the URL
		const imageURL = "https://example.com/image.png"; 
		
		const newUser: UserDTO = {
			firstName,
			lastName,
			alias,
			imageURL,
		};

		await userDAO.addUser(newUser);

		const authToken = FakeData.instance.authToken.token; // hardcode for now
		const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
		await authTokenDAO.addAuthToken(authToken, alias, Date.now() + MAX_AUTH_TIME);

		return [newUser, authToken];
	}
}
