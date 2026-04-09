"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const ServerStatusService_1 = require("../../model/service/ServerStatusService");
const DynamoDBFactory_1 = require("../../dao/DynamoDBDAO/DynamoDBFactory");
const MessageQueue_1 = require("./MessageQueue");
const handler = async (request) => {
    try {
        addStory(request.newStatus, request.token);
        const message = {
            followeeAlias: request.newStatus.user.alias,
            statusDTO: request.newStatus,
            token: request.token,
        };
        await (0, MessageQueue_1.sendSQSMessage)("https://sqs.us-east-1.amazonaws.com/735980888276/PostStatus", message);
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
async function addStory(newStatusDTO, token) {
    const statusService = new ServerStatusService_1.ServerStatusService(new DynamoDBFactory_1.DynamoDBDAOFactory());
    const newStatus = tweeter_shared_1.Status.fromDTO(newStatusDTO);
    if (!newStatus) {
        throw new Error("Bad Request: Status data is invalid");
    }
    await statusService.addStory(token, newStatus);
}
