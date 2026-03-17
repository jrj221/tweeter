"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerUserService_1 = require("../../model/service/ServerUserService");
const handler = async (request) => {
    const userService = new ServerUserService_1.ServerUserService();
    const [userDTO, token] = await userService.register(request.firstName, request.lastName, request.alias, request.password, Buffer.from(request.userImageBytes, "base64"), request.imageFileExtension);
    return {
        success: true,
        message: null,
        userDTO: userDTO,
        token: token,
    };
};
exports.handler = handler;
