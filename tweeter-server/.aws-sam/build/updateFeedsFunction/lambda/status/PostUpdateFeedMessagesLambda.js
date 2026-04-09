"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ServerFollowService_1 = require("../../model/service/ServerFollowService");
const DynamoDBFactory_1 = require("../../dao/DynamoDBDAO/DynamoDBFactory");
const MessageQueue_1 = require("./MessageQueue");
const handler = async (event) => {
    for (const record of event.Records) {
        // Based on configured batch size
        const postStatusMessage = JSON.parse(record.body); // More typechecking?
        const followers = await getAllFollowers(postStatusMessage.followeeAlias, postStatusMessage.token);
        for (let i = 0; i < followers.length; i += 400) {
            const followersSubset = followers.slice(i, i + 400);
            const message = {
                followees: followersSubset,
                statusDTO: postStatusMessage.statusDTO,
                token: postStatusMessage.token,
            };
            await (0, MessageQueue_1.sendSQSMessage)("https://sqs.us-east-1.amazonaws.com/735980888276/UpdateFeed", message);
        }
    }
};
exports.handler = handler;
async function getAllFollowers(followeeAlias, token) {
    const followService = new ServerFollowService_1.ServerFollowService(new DynamoDBFactory_1.DynamoDBDAOFactory());
    const followers = [];
    let lastFollower = null;
    let hasMoreFollowers = true;
    while (hasMoreFollowers) {
        const [newFollowers, more] = await followService.loadMoreFollowers(token, followeeAlias, 100, lastFollower);
        followers.push(...newFollowers.map((user) => user.alias));
        hasMoreFollowers = more;
        if (newFollowers.length > 0) {
            lastFollower = newFollowers[newFollowers.length - 1];
        }
    }
    return followers;
}
