"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerUserService = void 0;
const buffer_1 = require("buffer");
const tweeter_shared_1 = require("tweeter-shared");
class ServerUserService {
    async getUser(token, alias) {
        // TODO: Replace with the result of calling server
        const user = tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
        return user?.DTO ?? null;
    }
    async logout(authToken) {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
    }
    async login(alias, password) {
        // TODO: Replace with the result of calling the server
        return this.returnUser();
    }
    async register(firstName, lastName, alias, password, userImageBytes, imageFileExtension) {
        // FYI, I changed return value when doing login
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64 = buffer_1.Buffer.from(userImageBytes).toString("base64");
        // TODO: Replace with the result of calling the server
        return this.returnUser();
    }
    async returnUser() {
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid registration");
        }
        return [user.DTO, tweeter_shared_1.FakeData.instance.authToken.token]; // TS interprets it as an array instead of tuple without this cast idk why
    }
}
exports.ServerUserService = ServerUserService;
