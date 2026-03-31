"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerFollowService_1 = require("../../model/service/ServerFollowService");
const DynamoDBFactory_1 = require("../../dao/DynamoDBDAO/DynamoDBFactory");
const handler = async (request) => {
    try {
        const followService = new ServerFollowService_1.ServerFollowService(new DynamoDBFactory_1.DynamoDBDAOFactory());
        const [followerCount, followeeCount] = await followService.follow(request.token, request.user.alias, request.targetUser.alias);
        return {
            success: true,
            message: null,
            followerCount,
            followeeCount,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
            followerCount: 0,
            followeeCount: 0,
        };
    }
};
exports.handler = handler;
