import { DeleteCommand, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { FollowDAO } from "../DAO";
import { DynamoDBDAO } from "./DynamoDBDAO";
import { UserDTO } from "tweeter-shared";

export class DynamoDBFollowDAO extends DynamoDBDAO implements FollowDAO {
	private readonly _tableName = "follow";
	private readonly _followerAliasAttr = "followerAlias";
	private readonly _followeeAliasAttr = "followeeAlias";
	private readonly _indexName = "followee_index";

	async addFollow(followerAlias: string, followeeAlias: string): Promise<void> {
		const params = {
			TableName: this._tableName,
			Item: {
				[this._followerAliasAttr]: followerAlias,
				[this._followeeAliasAttr]: followeeAlias,
			},
		};
		await this._client.send(new PutCommand(params));
	}

	async removeFollow(followerAlias: string, followeeAlias: string): Promise<void> {
		const params = {
			TableName: this._tableName,
			Key: {
				[this._followerAliasAttr]: followerAlias,
				[this._followeeAliasAttr]: followeeAlias,
			},
		};
		await this._client.send(new DeleteCommand(params));
	}

	async getIsFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
		const params = {
			TableName: this._tableName,
			Key: {
				[this._followerAliasAttr]: followerAlias,
				[this._followeeAliasAttr]: followeeAlias,
			},
		};
		const output = await this._client.send(new GetCommand(params));
		return output.Item !== undefined;
	}

	async getPageOfFollowers(
		followeeAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]> {
		const params: any = {
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

		const output = await this._client.send(new QueryCommand(params));
		const followers =
			output.Items?.map((item) => ({
				alias: item[this._followerAliasAttr],
				// Other fields will be filled by the service layer or by fetching from User table
				firstName: "",
				lastName: "",
				imageURL: "",
			})) ?? [];

		return [followers as UserDTO[], output.LastEvaluatedKey !== undefined];
	}

	async getPageOfFollowees(
		followerAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]> {
		const params: any = {
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

		const output = await this._client.send(new QueryCommand(params));
		const followees =
			output.Items?.map((item) => ({
				alias: item[this._followeeAliasAttr],
				firstName: "",
				lastName: "",
				imageURL: "",
			})) ?? [];

		return [followees as UserDTO[], output.LastEvaluatedKey !== undefined];
	}
}
