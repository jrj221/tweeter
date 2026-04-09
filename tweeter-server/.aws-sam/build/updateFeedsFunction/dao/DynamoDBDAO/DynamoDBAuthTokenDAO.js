"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBAuthTokenDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const tweeter_shared_1 = require("tweeter-shared");
const DynamoDBDAO_1 = require("./DynamoDBDAO");
class DynamoDBAuthTokenDAO extends DynamoDBDAO_1.DynamoDBDAO {
    _tableName = "authToken";
    _tokenAttr = "token";
    _userAliasAttr = "userAlias";
    _expiresAtAttr = "expiresAt";
    async getAuthorizedTime(token) {
        const params = {
            TableName: this._tableName,
            Key: {
                [this._tokenAttr]: token,
            },
        };
        const output = await this._client.send(new lib_dynamodb_1.GetCommand(params));
        return output.Item === undefined ? null : output.Item[this._expiresAtAttr];
    }
    async updateAuthorizedTime(token) {
        const params = {
            TableName: this._tableName,
            Key: {
                [this._tokenAttr]: token,
            },
            UpdateExpression: "SET #expiresAt = :expiresAtValue",
            ExpressionAttributeNames: { "#expiresAt": this._expiresAtAttr },
            ExpressionAttributeValues: { ":expiresAtValue": Date.now() + tweeter_shared_1.MAX_AUTH_TIME },
        };
        await this._client.send(new lib_dynamodb_1.UpdateCommand(params));
    }
    async addAuthToken(token, userAlias, expiresAt) {
        const params = {
            TableName: this._tableName,
            Item: {
                [this._tokenAttr]: token,
                [this._userAliasAttr]: userAlias,
                [this._expiresAtAttr]: expiresAt,
            },
        };
        await this._client.send(new lib_dynamodb_1.PutCommand(params));
    }
    async removeAuthToken(token) {
        const params = {
            TableName: this._tableName,
            Key: {
                [this._tokenAttr]: token,
            },
        };
        await this._client.send(new lib_dynamodb_1.DeleteCommand(params));
    }
}
exports.DynamoDBAuthTokenDAO = DynamoDBAuthTokenDAO;
