"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBDAO = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class DynamoDBDAO {
    _client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    async getPage(params) {
        const output = await this._client.send(new lib_dynamodb_1.QueryCommand(params));
        return [output.Items ?? [], output.LastEvaluatedKey !== undefined];
    }
}
exports.DynamoDBDAO = DynamoDBDAO;
