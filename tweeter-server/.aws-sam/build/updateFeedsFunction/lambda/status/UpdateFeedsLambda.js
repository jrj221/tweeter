"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerStatusService_1 = require("../../model/service/ServerStatusService");
const DynamoDBFactory_1 = require("../../dao/DynamoDBDAO/DynamoDBFactory");
const handler = async (event) => {
    try {
        const statusService = new ServerStatusService_1.ServerStatusService(new DynamoDBFactory_1.DynamoDBDAOFactory());
        for (const record of event.Records) {
            const updateFeedMessage = JSON.parse(record.body);
            // Process blocks of 100 followers in batches of 25 for DynamoDB
            for (let i = 0; i < updateFeedMessage.followerAliases.length; i += 100) {
                const startTimeMillis = Date.now();
                // Send up to 4 batches of 25 (100 total) per second to respect WCU
                for (let j = 0; j < 100 && i + j < updateFeedMessage.followerAliases.length; j += 25) {
                    const followerBatch = updateFeedMessage.followerAliases.slice(i + j, i + j + 25);
                    if (followerBatch.length > 0) {
                        await statusService.batchAddFeedItemsInternal(updateFeedMessage.statusDTO, followerBatch);
                    }
                }
                const elapsedTimeMillis = Date.now() - startTimeMillis;
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
