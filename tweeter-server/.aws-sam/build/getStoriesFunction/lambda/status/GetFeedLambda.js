"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../../model/service/StatusService");
// This function gets called by API Gateway when you make a request
const handler = async (request) => {
    const statusService = new StatusService_1.StatusService();
    const [items, hasMore] = await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem);
    return { success: true, message: null, items: items, hasMoreItems: hasMore };
};
exports.handler = handler;
