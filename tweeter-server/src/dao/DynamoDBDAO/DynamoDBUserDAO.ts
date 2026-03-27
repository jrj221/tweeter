import { UserDTO } from "tweeter-shared";
import { UserDAO } from "../DAO";
import { DynamoDBDAO } from "./DynamoDBDAO";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoDBUserDAO extends DynamoDBDAO implements UserDAO {
	private readonly _tableName = "user";
	private readonly _aliasAttr = "alias";
	private readonly _firstNameAttr = "firstName";
	private readonly _lastNameAttr = "lastName";
	private readonly _imageURLAttr = "imageURL";
	private readonly _passwordAttr = "password";
	private readonly _followerCountAttr = "followerCount";
	private readonly _followeeCountAttr = "followeeCount";

	async findUserByAlias(alias: string): Promise<{
		firstName: string;
		lastName: string;
		alias: string;
		imageURL: string;
		passwordHash: string;
		followerCount: number;
		followeeCount: number;
	} | null> {
		const params = {
			TableName: this._tableName,
			Key: {
				[this._aliasAttr]: alias,
			},
		};

		const output = await this._client.send(new GetCommand(params));
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

	async addUser(
		firstName: string,
		lastName: string,
		alias: string,
		passwordHash: string,
		imageURL: string,
	): Promise<void> {
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
		await this._client.send(new PutCommand(params));
	}

	async updateFollowerCount(alias: string, count: number): Promise<void> {
		const params = {
			TableName: this._tableName,
			Key: { [this._aliasAttr]: alias },
			UpdateExpression: "SET #count = #count + :val",
			ExpressionAttributeNames: { "#count": this._followerCountAttr },
			ExpressionAttributeValues: { ":val": count },
		};
		await this._client.send(new UpdateCommand(params));
	}

	async updateFolloweeCount(alias: string, count: number): Promise<void> {
		const params = {
			TableName: this._tableName,
			Key: { [this._aliasAttr]: alias },
			UpdateExpression: "SET #count = #count + :val",
			ExpressionAttributeNames: { "#count": this._followeeCountAttr },
			ExpressionAttributeValues: { ":val": count },
		};
		await this._client.send(new UpdateCommand(params));
	}
}
