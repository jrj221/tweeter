import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class UserService implements Service {
	private facade = new ServerFacade();

	public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
		return this.facade.getUser({ token: authToken.token, alias: alias });
	}

	public async logout(authToken: AuthToken): Promise<void> {
		await this.facade.logout({ token: authToken.token });
	}

	public async login(alias: string, password: string): Promise<[User, AuthToken]> {
		return await this.facade.login({ alias: alias, password: password });
	}

	public async register(
		firstName: string,
		lastName: string,
		alias: string,
		password: string,
		userImageBytes: Uint8Array,
		imageFileExtension: string,
	): Promise<[User, AuthToken]> {
		const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");

		return await this.facade.register({
			firstName: firstName,
			lastName: lastName,
			alias: alias,
			password: password,
			userImageBytes: imageStringBase64,
			imageFileExtension: imageFileExtension,
		});
	}
}
