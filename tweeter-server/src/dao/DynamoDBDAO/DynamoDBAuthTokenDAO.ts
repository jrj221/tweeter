import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { AuthTokenDAO } from "../DAO";
import { DynamoDBDAO } from "./DynamoDBDAO";

export class DynamoDBAuthTokenDAO extends DynamoDBDAO implements AuthTokenDAO {
	private readonly _tableName: string = "authToken";
	private readonly _tokenAttr: string = "token";

	async getAuthorizedTime(token: string): Promise<number | null> {
		const params = {
			TableName: this._tableName,
			Key: {
				[this._tokenAttr]: token,
			},
		};

		const output = await this._client.send(new GetCommand(params));
		return output === undefined ? null : output.Item![this._tokenAttr];
	}

	async updateAuthorizedTime(token: string): Promise<void> {
		const params = {
			TableName: this._tableName,
			Key: {
				[this._tokenAttr]: token,
			},
			UpdateExpression: "SET #authTime = :authTimeValue",
			ExpressionAttributeNames: { "#authTime": "authTime" },
			ExpressionAttributeValues: { ":authTimeValue": Date.now() },
		};

		await this._client.send(new UpdateCommand(params));
	}
}
