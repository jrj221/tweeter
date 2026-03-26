import { DAOFactory } from "../../dao/DAOFactory";

export abstract class Service {
	private MAX_AUTH_TIME = 2 * 60 * 1000;

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
		if (!this.isAuthenticated(token)) {
			throw new Error("Invalid token");
		}
		const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
		await authTokenDAO.updateAuthorizedTime(token);
	}

	protected async isAuthenticated(token: string): Promise<boolean> {
		const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
		const timeSinceAuth = await authTokenDAO.getAuthorizedTime(token);
		if (timeSinceAuth === null) {
			throw new Error("Cannot find token in database"); // Figure out how the error handling works!
		}
		return timeSinceAuth < this.MAX_AUTH_TIME;
	}
}
