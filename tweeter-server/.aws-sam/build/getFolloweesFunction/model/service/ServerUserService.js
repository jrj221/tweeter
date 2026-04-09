"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerUserService = void 0;
const uuid_1 = require("uuid");
const tweeter_shared_1 = require("tweeter-shared");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Service_1 = require("./Service");
class ServerUserService extends Service_1.Service {
    async getUser(token, alias) {
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
    async logout(token) {
        this.checkParams(token);
        const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
        await authTokenDAO.removeAuthToken(token);
    }
    async login(alias, password) {
        this.checkParams(alias, password);
        const userDAO = this._daoFactory.makeUserDAO();
        const user = await userDAO.findUserByAlias(alias);
        if (user === null || !(await bcryptjs_1.default.compare(password, user.passwordHash))) {
            throw new Error("bad-request");
        }
        const userDto = {
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.alias,
            imageURL: user.imageURL,
        };
        const authToken = tweeter_shared_1.FakeData.instance.authToken.token; // hardcode for now
        const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
        await authTokenDAO.addAuthToken(authToken, alias, Date.now() + tweeter_shared_1.MAX_AUTH_TIME);
        return [userDto, authToken];
    }
    async register(firstName, lastName, alias, password, userImageBytes, imageFileExtension) {
        this.checkParams(firstName, lastName, alias, password, userImageBytes, imageFileExtension);
        const userDAO = this._daoFactory.makeUserDAO();
        const existingUser = await userDAO.findUserByAlias(alias);
        if (existingUser !== null) {
            throw new Error("bad-request: User with this alias already exists.");
        }
        const imageDAO = this._daoFactory.makeImageDAO();
        const filename = (0, uuid_1.v4)();
        await imageDAO.putImage(`${alias}-${filename}${imageFileExtension}`, userImageBytes);
        const imageURL = `https://tweeter-images-s3bucket.s3.us-east-1.amazonaws.com/image/${alias}-${filename}${imageFileExtension}`;
        const newUser = {
            firstName,
            lastName,
            alias,
            imageURL,
        };
        const salt = await bcryptjs_1.default.genSalt();
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        await userDAO.addUser(firstName, lastName, alias, hashedPassword, imageURL);
        const authToken = (0, uuid_1.v4)();
        const authTokenDAO = this._daoFactory.makeAuthTokenDAO();
        await authTokenDAO.addAuthToken(authToken, alias, Date.now() + tweeter_shared_1.MAX_AUTH_TIME);
        return [newUser, authToken];
    }
}
exports.ServerUserService = ServerUserService;
