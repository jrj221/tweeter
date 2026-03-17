"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerFollowService_1 = require("../../model/service/ServerFollowService");
const handler = async (request) => {
    const followService = new ServerFollowService_1.ServerFollowService();
    const count = await followService.getFolloweeCount(request.token, request.user);
    return {
        success: true,
        message: null,
        count: count,
    };
};
exports.handler = handler;
