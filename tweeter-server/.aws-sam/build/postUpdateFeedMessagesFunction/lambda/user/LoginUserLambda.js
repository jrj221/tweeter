"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerUserService_1 = require("../../model/service/ServerUserService");
const DynamoDBFactory_1 = require("../../dao/DynamoDBDAO/DynamoDBFactory");
const handler = async (request) => {
    try {
        const userService = new ServerUserService_1.ServerUserService(new DynamoDBFactory_1.DynamoDBDAOFactory());
        const [user, token] = await userService.login(request.alias, request.password);
        return { success: true, message: null, userDTO: user, token: token };
    }
    catch (error) {
        return { success: false, message: error.message, userDTO: null, token: null };
    }
};
exports.handler = handler;
