import { Buffer } from "buffer";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class UserService implements Service {
	public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
		// TODO: Replace with the result of calling server
		const facade = new ServerFacade();
		return facade.getUser({ token: authToken.token, alias: alias });
	}

	public async logout(authToken: AuthToken): Promise<void> {
		const facade = new ServerFacade();
		await facade.logout({ token: authToken.token });
	}

	public async login(alias: string, password: string): Promise<[User, AuthToken]> {
		// TODO: Replace with the result of calling the server
		const facade = new ServerFacade();
		return await facade.login({ alias: alias, password: password });
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

		const facade = new ServerFacade();
		return await facade.register({
			firstName: firstName,
			lastName: lastName,
			alias: alias,
			password: password,
			userImageBytes: imageStringBase64,
			imageFileExtension: imageFileExtension,
		});
	}
}
