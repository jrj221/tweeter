"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerUserService_1 = require("../../model/service/ServerUserService");
const handler = async (request) => {
    const userService = new ServerUserService_1.ServerUserService();
    const userDTO = await userService.getUser(request.token, request.alias);
    return { success: true, message: null, userDTO: userDTO };
};
exports.handler = handler;
