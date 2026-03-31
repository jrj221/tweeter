"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBStatusDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DynamoDBDAO_1 = require("./DynamoDBDAO");
class DynamoDBStatusDAO extends DynamoDBDAO_1.DynamoDBDAO {
    _tableName = "status";
    _authorAliasAttr = "authorAlias";
    _timestampAttr = "timestamp";
    _postAttr = "post";
    _segmentsAttr = "segmentDTOs";
    async addStatus(status) {
        const params = {
            TableName: this._tableName,
            Item: {
                [this._authorAliasAttr]: status.user.alias,
                [this._timestampAttr]: status.timestamp,
                [this._postAttr]: status.post,
                [this._segmentsAttr]: status.segments,
            },
        };
        await this._client.send(new lib_dynamodb_1.PutCommand(params));
    }
    async getPageOfStatuses(userAlias, pageSize, lastItem) {
        const params = {
            TableName: this._tableName,
            KeyConditionExpression: "#authorAlias = :authorAlias",
            ExpressionAttributeNames: { "#authorAlias": this._authorAliasAttr },
            ExpressionAttributeValues: { ":authorAlias": userAlias },
            Limit: pageSize,
            ScanIndexForward: false, // Chronological order (descending by timestamp?)
        };
        if (lastItem !== null) {
            params.ExclusiveStartKey = {
                [this._authorAliasAttr]: userAlias,
                [this._timestampAttr]: lastItem.timestamp,
            };
        }
        const output = await this._client.send(new lib_dynamodb_1.QueryCommand(params));
        const statuses = output.Items?.map((item) => ({
            post: item[this._postAttr],
            timestamp: item[this._timestampAttr],
            segments: item[this._segmentsAttr],
            user: { alias: item[this._authorAliasAttr], firstName: "", lastName: "", imageURL: "" },
        })) ?? [];
        return [statuses, output.LastEvaluatedKey !== undefined];
    }
}
exports.DynamoDBStatusDAO = DynamoDBStatusDAO;
