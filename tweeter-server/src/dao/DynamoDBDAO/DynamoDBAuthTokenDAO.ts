import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { MAX_AUTH_TIME } from "tweeter-shared";
import { AuthTokenDAO } from "../DAO";
import { DynamoDBDAO } from "./DynamoDBDAO";

export class DynamoDBAuthTokenDAO extends DynamoDBDAO implements AuthTokenDAO {
	private readonly _tableName: string = "authToken";
	private readonly _tokenAttr: string = "token";
	private readonly _userAliasAttr: string = "userAlias";
	private readonly _expiresAtAttr: string = "expiresAt";

	async getAuthorizedTime(token: string): Promise<number | null> {
		const params = {
			TableName: this._tableName,
			Key: {
				[this._tokenAttr]: token,
			},
		};

		const output = await this._client.send(new GetCommand(params));
		return output.Item === undefined ? null : Date.now() - output.Item[this._expiresAtAttr];
	}

	async updateAuthorizedTime(token: string): Promise<void> {
		const params = {
			TableName: this._tableName,
			Key: {
				[this._tokenAttr]: token,
			},
			UpdateExpression: "SET #expiresAt = :expiresAtValue",
			ExpressionAttributeNames: { "#expiresAt": this._expiresAtAttr },
			ExpressionAttributeValues: { ":expiresAtValue": Date.now() + MAX_AUTH_TIME },
		};

		await this._client.send(new UpdateCommand(params));
	}

	async addAuthToken(token: string, userAlias: string, expiresAt: number): Promise<void> {
		const params = {
			TableName: this._tableName,
			Item: {
				[this._tokenAttr]: token,
				[this._userAliasAttr]: userAlias,
				[this._expiresAtAttr]: Date.now() + MAX_AUTH_TIME,
			},
		};
		await this._client.send(new PutCommand(params));
	}

	async removeAuthToken(token: string): Promise<void> {
		const params = {
			TableName: this._tableName,
			Key: {
				[this._tokenAttr]: token,
			},
		};
		await this._client.send(new DeleteCommand(params));
	}
}
