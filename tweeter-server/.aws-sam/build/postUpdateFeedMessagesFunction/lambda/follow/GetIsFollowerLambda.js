"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const ServerFollowService_1 = require("../../model/service/ServerFollowService");
const DynamoDBFactory_1 = require("../../dao/DynamoDBDAO/DynamoDBFactory");
const handler = async (request) => {
    try {
        const followService = new ServerFollowService_1.ServerFollowService(new DynamoDBFactory_1.DynamoDBDAOFactory());
        const user = tweeter_shared_1.User.fromDTO(request.user);
        const selectedUser = tweeter_shared_1.User.fromDTO(request.selectedUser);
        if (!user || !selectedUser) {
            throw new Error("Bad Request: User data is invalid");
        }
        const isFollower = await followService.getIsFollowerStatus(request.token, user.alias, selectedUser.alias);
        return {
            success: true,
            message: null,
            isFollower: isFollower,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
            isFollower: false,
        };
    }
};
exports.handler = handler;
