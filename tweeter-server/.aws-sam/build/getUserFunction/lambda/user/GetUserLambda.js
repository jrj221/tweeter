"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerUserService_1 = require("../../model/service/ServerUserService");
const handler = async (request) => {
    const userService = new ServerUserService_1.ServerUserService();
    const user = await userService.getUser(request.token, request.alias);
    return { success: true, message: null, user: user };
};
exports.handler = handler;
