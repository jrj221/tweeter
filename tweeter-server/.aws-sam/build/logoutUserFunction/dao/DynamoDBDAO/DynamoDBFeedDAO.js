"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBFeedDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DynamoDBDAO_1 = require("./DynamoDBDAO");
class DynamoDBFeedDAO extends DynamoDBDAO_1.DynamoDBDAO {
    _tableName = "feed";
    _followerAliasAttr = "followerAlias";
    _timestampAttr = "timestamp";
    _authorAliasAttr = "authorAlias";
    _postAttr = "post";
    _segmentsAttr = "segmentDTOs";
    async addFeedItem(followerAlias, status) {
        const params = {
            TableName: this._tableName,
            Item: {
                [this._followerAliasAttr]: followerAlias,
                [this._timestampAttr]: status.timestamp,
                [this._authorAliasAttr]: status.user.alias,
                [this._postAttr]: status.post,
                [this._segmentsAttr]: status.segments,
            },
        };
        await this._client.send(new lib_dynamodb_1.PutCommand(params));
    }
    /**
     * Adds up to 25 feed items to the database in a single batch operation.
     */
    async batchAddFeedItems(followerAliases, status) {
        const writeRequests = followerAliases.map((alias) => ({
            PutRequest: {
                Item: {
                    [this._followerAliasAttr]: alias,
                    [this._timestampAttr]: status.timestamp,
                    [this._authorAliasAttr]: status.user.alias,
                    [this._postAttr]: status.post,
                    [this._segmentsAttr]: status.segments,
                },
            },
        }));
        const params = {
            RequestItems: {
                [this._tableName]: writeRequests,
            },
        };
        await this._client.send(new lib_dynamodb_1.BatchWriteCommand(params));
    }
    async getPageOfFeedItems(followerAlias, pageSize, lastItem) {
        const [items, hasMore] = await this.getPage({
            TableName: this._tableName,
            KeyConditionExpression: "#followerAlias = :followerAlias",
            ExpressionAttributeNames: { "#followerAlias": this._followerAliasAttr },
            ExpressionAttributeValues: { ":followerAlias": followerAlias },
            Limit: pageSize,
            ExclusiveStartKey: lastItem === null
                ? undefined
                : {
                    [this._followerAliasAttr]: followerAlias,
                    [this._timestampAttr]: lastItem.timestamp,
                },
        });
        const statuses = items.map((item) => ({
            post: item[this._postAttr],
            timestamp: item[this._timestampAttr],
            segments: item[this._segmentsAttr],
            user: { alias: item[this._authorAliasAttr], firstName: "", lastName: "", imageURL: "" },
        }));
        return [statuses, hasMore];
    }
}
exports.DynamoDBFeedDAO = DynamoDBFeedDAO;
