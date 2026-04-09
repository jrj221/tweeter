"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerStatusService_1 = require("../../model/service/ServerStatusService");
const DynamoDBFactory_1 = require("../../dao/DynamoDBDAO/DynamoDBFactory");
const handler = async (event) => {
    try {
        for (const record of event.Records) {
            // Based on configured batch size
            const updateFeedMessage = JSON.parse(record.body); // More typechecking?
            const statusService = new ServerStatusService_1.ServerStatusService(new DynamoDBFactory_1.DynamoDBDAOFactory());
            for (let i = 0; i < updateFeedMessage.followerAliases.length; i += 100) {
                const startTimeMilllis = Date.now();
                for (let j = 0; j < 4; j++) {
                    const followerBatch = updateFeedMessage.followerAliases.slice(i + j * 25, i + (j + 1) * 25);
                    if (followerBatch.length > 0) {
                        await statusService.batchAddFeedItemsInternal(updateFeedMessage.statusDTO, followerBatch);
                    }
                }
                const elapsedTimeMillis = Date.now() - startTimeMilllis;
                if (elapsedTimeMillis < 1000) {
                    await new Promise((resolve) => setTimeout(resolve, 1000 - elapsedTimeMillis));
                }
            }
        }
    }
    catch (error) {
        console.error("Error updating feeds:", error.message);
        throw error;
    }
};
exports.handler = handler;
