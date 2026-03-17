"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerFollowService_1 = require("../../model/service/ServerFollowService");
// This function gets called by API Gateway when you make a request
const handler = async (request) => {
    const followService = new ServerFollowService_1.ServerFollowService();
    const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.alias, request.pageSize, request.lastItem);
    return { success: true, message: null, items: items, hasMoreItems: hasMore };
};
exports.handler = handler;
