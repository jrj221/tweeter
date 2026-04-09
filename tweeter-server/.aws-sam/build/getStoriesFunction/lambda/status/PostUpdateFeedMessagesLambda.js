"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerFollowService_1 = require("../../model/service/ServerFollowService");
const DynamoDBFactory_1 = require("../../dao/DynamoDBDAO/DynamoDBFactory");
const MessageQueue_1 = require("./MessageQueue");
const handler = async (event) => {
    try {
        const factory = new DynamoDBFactory_1.DynamoDBDAOFactory();
        const followService = new ServerFollowService_1.ServerFollowService(factory);
        const url = "https://sqs.us-east-1.amazonaws.com/735980888276/UpdateFeed";
        for (const record of event.Records) {
            const postStatusMessage = JSON.parse(record.body);
            let lastFollowerAlias = null;
            let hasMoreFollowers = true;
            const followerBuffer = [];
            const sqsBatch = [];
            while (hasMoreFollowers) {
                const [newFollowerAliases, more] = await followService.loadMoreFollowerAliases(postStatusMessage.token, postStatusMessage.followeeAlias, 100, lastFollowerAlias, false);
                hasMoreFollowers = more;
                followerBuffer.push(...newFollowerAliases);
                if (newFollowerAliases.length > 0) {
                    lastFollowerAlias = newFollowerAliases[newFollowerAliases.length - 1];
                }
                // Process full groups of 400 from the buffer
                while (followerBuffer.length >= 400) {
                    const followersSubset = followerBuffer.splice(0, 400);
                    const message = {
                        followerAliases: followersSubset,
                        statusDTO: postStatusMessage.statusDTO,
                        token: postStatusMessage.token,
                    };
                    sqsBatch.push(message);
                    if (sqsBatch.length === 10) {
                        await (0, MessageQueue_1.sendSQSMessageBatch)(url, sqsBatch);
                        sqsBatch.length = 0;
                    }
                }
            }
            // After all pages for this record, handle leftovers
            if (followerBuffer.length > 0) {
                const message = {
                    followerAliases: followerBuffer,
                    statusDTO: postStatusMessage.statusDTO,
                    token: postStatusMessage.token,
                };
                sqsBatch.push(message);
            }
            if (sqsBatch.length > 0) {
                await (0, MessageQueue_1.sendSQSMessageBatch)(url, sqsBatch);
            }
        }
    }
    catch (error) {
        console.error("Error posting update feed messages:", error.message);
        throw error;
    }
};
exports.handler = handler;
