"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBUserDAO = void 0;
const DynamoDBDAO_1 = require("./DynamoDBDAO");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class DynamoDBUserDAO extends DynamoDBDAO_1.DynamoDBDAO {
    _tableName = "user";
    _aliasAttr = "alias";
    _firstNameAttr = "firstName";
    _lastNameAttr = "lastName";
    _imageURLAttr = "imageURL";
    _passwordAttr = "password";
    _followerCountAttr = "followerCount";
    _followeeCountAttr = "followeeCount";
    async findUserByAlias(alias) {
        const params = {
            TableName: this._tableName,
            Key: {
                [this._aliasAttr]: alias,
            },
        };
        const output = await this._client.send(new lib_dynamodb_1.GetCommand(params));
        return output.Item === undefined
            ? null
            : {
                firstName: output.Item[this._firstNameAttr],
                lastName: output.Item[this._lastNameAttr],
                alias: output.Item[this._aliasAttr],
                imageURL: output.Item[this._imageURLAttr],
                passwordHash: output.Item[this._passwordAttr],
                followerCount: output.Item[this._followerCountAttr],
                followeeCount: output.Item[this._followeeCountAttr],
            };
    }
    async addUser(firstName, lastName, alias, passwordHash, imageURL) {
        const params = {
            TableName: this._tableName,
            Item: {
                [this._aliasAttr]: alias,
                [this._firstNameAttr]: firstName,
                [this._lastNameAttr]: lastName,
                [this._passwordAttr]: passwordHash,
                [this._imageURLAttr]: imageURL,
                [this._followerCountAttr]: 0,
                [this._followeeCountAttr]: 0,
            },
        };
        await this._client.send(new lib_dynamodb_1.PutCommand(params));
    }
    async updateFollowerCount(alias, count) {
        const params = {
            TableName: this._tableName,
            Key: { [this._aliasAttr]: alias },
            UpdateExpression: "SET #count = #count + :val",
            ExpressionAttributeNames: { "#count": this._followerCountAttr },
            ExpressionAttributeValues: { ":val": count },
        };
        await this._client.send(new lib_dynamodb_1.UpdateCommand(params));
    }
    async updateFolloweeCount(alias, count) {
        const params = {
            TableName: this._tableName,
            Key: { [this._aliasAttr]: alias },
            UpdateExpression: "SET #count = #count + :val",
            ExpressionAttributeNames: { "#count": this._followeeCountAttr },
            ExpressionAttributeValues: { ":val": count },
        };
        await this._client.send(new lib_dynamodb_1.UpdateCommand(params));
    }
}
exports.DynamoDBUserDAO = DynamoDBUserDAO;
