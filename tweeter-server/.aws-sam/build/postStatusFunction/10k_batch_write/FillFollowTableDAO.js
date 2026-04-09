"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FillFollowTableDao = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class FillFollowTableDao {
    //
    // Modify these values as needed to match your follow table.
    //
    tableName = "follow";
    followerAliasAttribute = "followerAlias";
    followeeAliasAttribute = "followeeAlias";
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    async createFollows(followeeAlias, followerAliasList) {
        if (followerAliasList.length == 0) {
            console.log("Zero followers to batch write");
            return;
        }
        else {
            const params = {
                RequestItems: {
                    [this.tableName]: this.createPutFollowRequestItems(followeeAlias, followerAliasList),
                },
            };
            try {
                const response = await this.client.send(new lib_dynamodb_1.BatchWriteCommand(params));
                await this.putUnprocessedItems(response, params);
            }
            catch (err) {
                throw new Error(`Error while batch writing follows with params: ${params} \n${err}`);
            }
        }
    }
    createPutFollowRequestItems(followeeAlias, followerAliasList) {
        return followerAliasList.map((followerAlias) => this.createPutFollowRequest(followerAlias, followeeAlias));
    }
    createPutFollowRequest(followerAlias, followeeAlias) {
        const item = {
            [this.followerAliasAttribute]: followerAlias,
            [this.followeeAliasAttribute]: followeeAlias,
        };
        return {
            PutRequest: {
                Item: item,
            },
        };
    }
    async putUnprocessedItems(resp, params) {
        let delay = 10;
        let attempts = 0;
        while (resp.UnprocessedItems !== undefined && Object.keys(resp.UnprocessedItems).length > 0) {
            attempts++;
            if (attempts > 1) {
                // Pause before the next attempt
                await new Promise((resolve) => setTimeout(resolve, delay));
                // Increase pause time for next attempt
                if (delay < 1000) {
                    delay += 100;
                }
            }
            console.log(`Attempt ${attempts}. Processing ${Object.keys(resp.UnprocessedItems).length} unprocessed follow items.`);
            params.RequestItems = resp.UnprocessedItems;
            resp = await this.client.send(new lib_dynamodb_1.BatchWriteCommand(params));
        }
    }
}
exports.FillFollowTableDao = FillFollowTableDao;
