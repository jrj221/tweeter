"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const ServerStatusService_1 = require("../../model/service/ServerStatusService");
const DynamoDBFactory_1 = require("../../dao/DynamoDBDAO/DynamoDBFactory");
const handler = async (request) => {
    try {
        const statusService = new ServerStatusService_1.ServerStatusService(new DynamoDBFactory_1.DynamoDBDAOFactory());
        const newStatus = tweeter_shared_1.Status.fromDTO(request.newStatus);
        if (!newStatus) {
            throw new Error("Bad Request: Status data is invalid");
        }
        await statusService.postStatus(request.token, newStatus);
        return {
            success: true,
            message: null,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.handler = handler;
