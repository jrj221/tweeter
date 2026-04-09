import { AuthToken, MAX_AUTH_TIME, UserDTO } from "tweeter-shared";
import { DAOFactory } from "../../dao/DAOFactory";

export abstract class Service {
	protected _daoFactory: DAOFactory;

	public constructor(daoFactory: DAOFactory) {
		this._daoFactory = daoFactory;
	}

	/**
	 * Checks if the token is valid and refreshes the authorized time if so
	 * @param token The token to authenticate
	 * @throws Error if the token is invalid or not in the database
	 */
	protected async doAuthenticate(token: string): Promise<void> {
		if (!(await this.isAuthenticated(token))) {
			throw new Error("unauthorized: Your session has expired, please log back in.");
		}
		const authTokenDAO = this._daoFactory.makeAuthTokenDAO(); // Should you call for a dao every time you need one, or at what point do you make a dao for the entire class?
		await authTokenDAO.updateAuthorizedTime(token);
	}

	protected async isAuthenticated(token: string): Promise<boolean> {
		const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
		const authExpiration = await authTokenDAO.getAuthorizedTime(token);

		if (authExpiration === null) {
			throw new Error("bad-request: Invalid token provided."); // Figure out how the error handling works
		}

		return Date.now() < authExpiration;
	}

	protected async getMoreItems<T>(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: T | null,
		getPage: (alias: string, limit: number, last: T | null) => Promise<[T[], boolean]>,
		populateItems: (items: T[]) => Promise<void>,
		authenticate: boolean = true,
	): Promise<[T[], boolean]> {
		this.checkParams(token, userAlias, pageSize);
		if (authenticate) {
			await this.doAuthenticate(token);
		}

		const [items, hasMore] = await getPage(userAlias, pageSize, lastItem);
		await populateItems(items);

		return [items, hasMore];
	}

	protected async populateUsers<T>(
		items: T[],
		getAlias: (item: T) => string,
		injectUser: (item: T, user: UserDTO) => void,
	): Promise<void> {
		const userDAO = this._daoFactory.makeUserDAO();
		for (const item of items) {
			const alias = getAlias(item);
			const user = await userDAO.findUserByAlias(alias);
			if (user) {
				injectUser(item, {
					firstName: user.firstName,
					lastName: user.lastName,
					alias: user.alias,
					imageURL: user.imageURL,
				});
			}
		}
	}

	protected checkParams(...params: any[]) {
		for (const param of params) {
			if (param === null || param === undefined || param === "") {
				throw new Error("bad-request");
			}
		}
	}
}
