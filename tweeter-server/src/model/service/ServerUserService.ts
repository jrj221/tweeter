import { Buffer } from "buffer";
import { AuthToken, User, FakeData, UserDTO } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../../dao/DAOFactory";

export class ServerUserService implements Service {
	private _daoFactory: DAOFactory;

	public constructor(daoFactory: DAOFactory) {
		this._daoFactory = daoFactory;
	}

	public async getUser(token: string, alias: string): Promise<UserDTO | null> {
		const userDAO = this._daoFactory.makeUserDAO();
		const user: User | null = await userDAO.findUserByAlias(alias);
		return user?.DTO ?? null;
	}

	public async logout(token: string): Promise<void> {
		// Pause so we can see the logging out message. Delete when the call to the server is implemented.
		// await new Promise((res) => setTimeout(res, 1000));
	}

	public async login(alias: string, password: string): Promise<[UserDTO, string]> {
		return this.returnUser();
	}

	public async register(
		firstName: string,
		lastName: string,
		alias: string,
		password: string,
		userImageBytes: Uint8Array,
		imageFileExtension: string,
	): Promise<[UserDTO, string]> {
		const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");
		return this.returnUser();
	}

	private async returnUser() {
		const user = FakeData.instance.firstUser;

		if (user === null) {
			throw new Error("Invalid registration");
		}

		return [user.DTO, FakeData.instance.authToken.token] as [UserDTO, string]; // TS interprets it as an array instead of tuple without this cast idk why
	}
}
