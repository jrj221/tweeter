"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerFollowService_1 = require("../../model/service/ServerFollowService");
const handler = async (request) => {
    const followService = new ServerFollowService_1.ServerFollowService();
    const [followerCount, followeeCount] = await followService.follow(request.token, request.targetUser);
    return {
        success: true,
        message: null,
        followerCount,
        followeeCount,
    };
};
exports.handler = handler;
