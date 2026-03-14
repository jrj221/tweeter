"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
// This function gets called by API Gateway when you make a request
const handler = async (request) => {
    const followService = new FollowService_1.FollowService();
    const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);
    return { success: true, message: null, items: items, hasMoreItems: hasMore };
};
exports.handler = handler;
