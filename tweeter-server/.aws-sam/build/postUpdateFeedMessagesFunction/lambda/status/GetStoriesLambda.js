"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerStatusService_1 = require("../../model/service/ServerStatusService");
const DynamoDBFactory_1 = require("../../dao/DynamoDBDAO/DynamoDBFactory");
// This function gets called by API Gateway when you make a request
const handler = async (request) => {
    try {
        const statusService = new ServerStatusService_1.ServerStatusService(new DynamoDBFactory_1.DynamoDBDAOFactory());
        const [items, hasMore] = await statusService.loadMoreStoryItems(request.token, request.alias, request.pageSize, request.lastItem);
        return { success: true, message: null, items: items, hasMoreItems: hasMore };
    }
    catch (error) {
        return { success: false, message: error.message, items: null, hasMoreItems: false };
    }
};
exports.handler = handler;
