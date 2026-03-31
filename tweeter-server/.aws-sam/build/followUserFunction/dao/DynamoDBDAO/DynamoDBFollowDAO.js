"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBFollowDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DynamoDBDAO_1 = require("./DynamoDBDAO");
class DynamoDBFollowDAO extends DynamoDBDAO_1.DynamoDBDAO {
    _tableName = "follow";
    _followerAliasAttr = "followerAlias";
    _followeeAliasAttr = "followeeAlias";
    _indexName = "followee_index";
    async addFollow(followerAlias, followeeAlias) {
        const params = {
            TableName: this._tableName,
            Item: {
                [this._followerAliasAttr]: followerAlias,
                [this._followeeAliasAttr]: followeeAlias,
            },
        };
        await this._client.send(new lib_dynamodb_1.PutCommand(params));
    }
    async removeFollow(followerAlias, followeeAlias) {
        const params = {
            TableName: this._tableName,
            Key: {
                [this._followerAliasAttr]: followerAlias,
                [this._followeeAliasAttr]: followeeAlias,
            },
        };
        await this._client.send(new lib_dynamodb_1.DeleteCommand(params));
    }
    async getIsFollower(followerAlias, followeeAlias) {
        const params = {
            TableName: this._tableName,
            Key: {
                [this._followerAliasAttr]: followerAlias,
                [this._followeeAliasAttr]: followeeAlias,
            },
        };
        const output = await this._client.send(new lib_dynamodb_1.GetCommand(params));
        return output.Item !== undefined;
    }
    async getPageOfFollowers(followeeAlias, pageSize, lastItem) {
        const params = {
            TableName: this._tableName,
            IndexName: this._indexName,
            KeyConditionExpression: "#followeeAlias = :followeeAlias",
            ExpressionAttributeNames: { "#followeeAlias": this._followeeAliasAttr },
            ExpressionAttributeValues: { ":followeeAlias": followeeAlias },
            Limit: pageSize,
        };
        if (lastItem !== null) {
            params.ExclusiveStartKey = {
                [this._followeeAliasAttr]: followeeAlias,
                [this._followerAliasAttr]: lastItem.alias,
            };
        }
        const output = await this._client.send(new lib_dynamodb_1.QueryCommand(params));
        const followers = output.Items?.map((item) => ({
            alias: item[this._followerAliasAttr],
            // Other fields will be filled by the service layer or by fetching from User table
            firstName: "",
            lastName: "",
            imageURL: "",
        })) ?? [];
        return [followers, output.LastEvaluatedKey !== undefined];
    }
    async getPageOfFollowees(followerAlias, pageSize, lastItem) {
        const params = {
            TableName: this._tableName,
            KeyConditionExpression: "#followerAlias = :followerAlias",
            ExpressionAttributeNames: { "#followerAlias": this._followerAliasAttr },
            ExpressionAttributeValues: { ":followerAlias": followerAlias },
            Limit: pageSize,
        };
        if (lastItem !== null) {
            params.ExclusiveStartKey = {
                [this._followerAliasAttr]: followerAlias,
                [this._followeeAliasAttr]: lastItem.alias,
            };
        }
        const output = await this._client.send(new lib_dynamodb_1.QueryCommand(params));
        const followees = output.Items?.map((item) => ({
            alias: item[this._followeeAliasAttr],
            firstName: "",
            lastName: "",
            imageURL: "",
        })) ?? [];
        return [followees, output.LastEvaluatedKey !== undefined];
    }
}
exports.DynamoDBFollowDAO = DynamoDBFollowDAO;
