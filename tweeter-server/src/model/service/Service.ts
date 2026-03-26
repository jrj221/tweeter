import { AuthToken, MAX_AUTH_TIME } from "tweeter-shared";
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
		if (!this.isAuthenticated(token)) {
			throw new Error("unauthorized");
		}
		const authTokenDAO = this._daoFactory.makeAuthTokenDAO(); // Should you call for a dao every time you need one, or at what point do you make a dao for the entire class?
		await authTokenDAO.updateAuthorizedTime(token);
	}

	protected async isAuthenticated(token: string): Promise<boolean> {
		const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
		const timeSinceAuth = await authTokenDAO.getAuthorizedTime(token);
		if (timeSinceAuth === null) {
			throw new Error("bad-request"); // Figure out how the error handling works
		}
		return timeSinceAuth < MAX_AUTH_TIME;
	}
}
