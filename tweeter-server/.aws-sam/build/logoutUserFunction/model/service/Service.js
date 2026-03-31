"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class Service {
    _daoFactory;
    constructor(daoFactory) {
        this._daoFactory = daoFactory;
    }
    /**
     * Checks if the token is valid and refreshes the authorized time if so
     * @param token The token to authenticate
     * @throws Error if the token is invalid or not in the database
     */
    async doAuthenticate(token) {
        if (!this.isAuthenticated(token)) {
            throw new Error("unauthorized");
        }
        const authTokenDAO = this._daoFactory.makeAuthTokenDAO(); // Should you call for a dao every time you need one, or at what point do you make a dao for the entire class?
        await authTokenDAO.updateAuthorizedTime(token);
    }
    async isAuthenticated(token) {
        const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
        const timeSinceAuth = await authTokenDAO.getAuthorizedTime(token);
        if (timeSinceAuth === null) {
            throw new Error("bad-request"); // Figure out how the error handling works
        }
        return timeSinceAuth < tweeter_shared_1.MAX_AUTH_TIME;
    }
    checkParams(...params) {
        for (const param of params) {
            if (param === null || param === undefined || param === "") {
                throw new Error("bad-request");
            }
        }
    }
}
exports.Service = Service;
