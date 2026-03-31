"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerUserService_1 = require("../../model/service/ServerUserService");
const DynamoDBFactory_1 = require("../../dao/DynamoDBDAO/DynamoDBFactory");
const handler = async (request) => {
    try {
        const userService = new ServerUserService_1.ServerUserService(new DynamoDBFactory_1.DynamoDBDAOFactory());
        const [userDTO, token] = await userService.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBytes, request.imageFileExtension);
        return {
            success: true,
            message: null,
            userDTO: userDTO,
            token: token,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
            userDTO: null,
            token: null,
        };
    }
};
exports.handler = handler;
