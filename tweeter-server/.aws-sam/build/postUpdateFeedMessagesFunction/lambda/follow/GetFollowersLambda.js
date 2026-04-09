"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerFollowService_1 = require("../../model/service/ServerFollowService");
const DynamoDBFactory_1 = require("../../dao/DynamoDBDAO/DynamoDBFactory");
// This function gets called by API Gateway when you make a request
const handler = async (request) => {
    try {
        const followService = new ServerFollowService_1.ServerFollowService(new DynamoDBFactory_1.DynamoDBDAOFactory());
        const [items, hasMore] = await followService.loadMoreFollowers(request.token, request.alias, request.pageSize, request.lastItem);
        return { success: true, message: null, items: items, hasMoreItems: hasMore };
    }
    catch (error) {
        return { success: false, message: error.message, items: null, hasMoreItems: false };
    }
};
exports.handler = handler;
