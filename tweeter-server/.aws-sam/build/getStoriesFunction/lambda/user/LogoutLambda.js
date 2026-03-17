"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerUserService_1 = require("../../model/service/ServerUserService");
const handler = async (request) => {
    const userService = new ServerUserService_1.ServerUserService();
    await userService.logout(request.token);
    return {
        success: true,
        message: null,
    };
};
exports.handler = handler;
