import { Buffer } from "buffer";
import { FakeData, UserDTO, MAX_AUTH_TIME } from "tweeter-shared";
import bcryptjs from "bcryptjs";
import { Service } from "./Service";

export class ServerUserService extends Service {
	public async getUser(token: string, alias: string): Promise<UserDTO | null> {
		this.checkParams(token, alias);
		await this.doAuthenticate(token);
		const userDAO = this._daoFactory.makeUserDAO();
		const user = await userDAO.findUserByAlias(alias);
		return user === null
			? null
			: {
					firstName: user.firstName,
					lastName: user.lastName,
					alias: user.alias,
					imageURL: user.imageURL,
				};
	}

	public async logout(token: string): Promise<void> {
		this.checkParams(token);
		await this.doAuthenticate(token);
		const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
		await authTokenDAO.removeAuthToken(token);
	}

	public async login(alias: string, password: string): Promise<[UserDTO, string]> {
		this.checkParams(alias, password);
		const userDAO = this._daoFactory.makeUserDAO();
		const user = await userDAO.findUserByAlias(alias);

		if (user === null || !(await bcryptjs.compare(password, user.passwordHash))) {
			throw new Error("bad-request");
		}

		const userDto: UserDTO = {
			firstName: user.firstName,
			lastName: user.lastName,
			alias: user.alias,
			imageURL: user.imageURL,
		};

		const authToken = FakeData.instance.authToken.token; // hardcode for now
		const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
		await authTokenDAO.addAuthToken(authToken, alias, Date.now() + MAX_AUTH_TIME);

		return [userDto, authToken];
	}

	public async register(
		firstName: string,
		lastName: string,
		alias: string,
		password: string,
		userImageBytes: Uint8Array,
		imageFileExtension: string,
	): Promise<[UserDTO, string]> {
		this.checkParams(firstName, lastName, alias, password, userImageBytes, imageFileExtension);
		const userDAO = this._daoFactory.makeUserDAO();

		// In a real app, we would upload the image to S3 here and get the URL
		const imageURL = "https://example.com/image.png";

		const newUser: UserDTO = {
			firstName,
			lastName,
			alias,
			imageURL,
		};

		const salt = await bcryptjs.genSalt();
		const hashedPassword = await bcryptjs.hash(password, salt);
		await userDAO.addUser(firstName, lastName, alias, hashedPassword, imageURL);

		const authToken = FakeData.instance.authToken.token; // hardcode for now
		const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
		await authTokenDAO.addAuthToken(authToken, alias, Date.now() + MAX_AUTH_TIME);

		return [newUser, authToken];
	}
}
