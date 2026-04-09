"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
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
        if (!(await this.isAuthenticated(token))) {
            throw new Error("unauthorized: Your session has expired, please log back in.");
        }
        const authTokenDAO = this._daoFactory.makeAuthTokenDAO(); // Should you call for a dao every time you need one, or at what point do you make a dao for the entire class?
        await authTokenDAO.updateAuthorizedTime(token);
    }
    async isAuthenticated(token) {
        const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
        const authExpiration = await authTokenDAO.getAuthorizedTime(token);
        if (authExpiration === null) {
            throw new Error("bad-request: Invalid token provided."); // Figure out how the error handling works
        }
        return Date.now() < authExpiration;
    }
    async getMoreItems(token, userAlias, pageSize, lastItem, getPage, populateItems, authenticate = true) {
        this.checkParams(token, userAlias, pageSize);
        if (authenticate) {
            await this.doAuthenticate(token);
        }
        const [items, hasMore] = await getPage(userAlias, pageSize, lastItem);
        await populateItems(items);
        return [items, hasMore];
    }
    async populateUsers(items, getAlias, injectUser) {
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
    checkParams(...params) {
        for (const param of params) {
            if (param === null || param === undefined || param === "") {
                throw new Error("bad-request");
            }
        }
    }
}
exports.Service = Service;
