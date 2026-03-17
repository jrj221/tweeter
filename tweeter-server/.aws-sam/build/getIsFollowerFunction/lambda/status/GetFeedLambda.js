"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerStatusService_1 = require("../../model/service/ServerStatusService");
// This function gets called by API Gateway when you make a request
const handler = async (request) => {
    const statusService = new ServerStatusService_1.ServerStatusService();
    const [items, hasMore] = await statusService.loadMoreFeedItems(request.token, request.alias, request.pageSize, request.lastItem);
    return { success: true, message: null, items: items, hasMoreItems: hasMore };
};
exports.handler = handler;
