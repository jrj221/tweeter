"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const ServerFollowService_1 = require("../../model/service/ServerFollowService");
const handler = async (request) => {
    const followService = new ServerFollowService_1.ServerFollowService();
    const user = tweeter_shared_1.User.fromDTO(request.user);
    const selectedUser = tweeter_shared_1.User.fromDTO(request.selectedUser);
    if (!user || !selectedUser) {
        throw new Error("Bad Request: User data is invalid");
    }
    const isFollower = await followService.getIsFollowerStatus({ token: request.token, timestamp: Date.now() }, user, selectedUser);
    return {
        success: true,
        message: null,
        isFollower: isFollower,
    };
};
exports.handler = handler;
