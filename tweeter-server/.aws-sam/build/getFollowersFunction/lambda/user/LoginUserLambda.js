"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerUserService_1 = require("../../model/service/ServerUserService");
const handler = async (request) => {
    const userService = new ServerUserService_1.ServerUserService();
    const [user, token] = await userService.login(request.alias, request.password);
    return { success: true, message: null, userDTO: user, token: token };
};
exports.handler = handler;
