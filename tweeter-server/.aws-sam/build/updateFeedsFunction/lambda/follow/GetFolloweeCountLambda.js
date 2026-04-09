"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerFollowService_1 = require("../../model/service/ServerFollowService");
const DynamoDBFactory_1 = require("../../dao/DynamoDBDAO/DynamoDBFactory");
const handler = async (request) => {
    try {
        const followService = new ServerFollowService_1.ServerFollowService(new DynamoDBFactory_1.DynamoDBDAOFactory());
        const count = await followService.getFolloweeCount(request.token, request.user.alias);
        return {
            success: true,
            message: null,
            count: count,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
            count: 0,
        };
    }
};
exports.handler = handler;
