import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
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
			Item: this.getFollowKey(followerAlias, followeeAlias),
		};
		await this._client.send(new PutCommand(params));
	}

	async removeFollow(followerAlias: string, followeeAlias: string): Promise<void> {
		const params = {
			TableName: this._tableName,
			Key: this.getFollowKey(followerAlias, followeeAlias),
		};
		await this._client.send(new DeleteCommand(params));
	}

	async getIsFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
		const params = {
			TableName: this._tableName,
			Key: this.getFollowKey(followerAlias, followeeAlias),
		};
		const output = await this._client.send(new GetCommand(params));
		return output.Item !== undefined;
	}

	private getFollowKey(followerAlias: string, followeeAlias: string) {
		return {
			[this._followerAliasAttr]: followerAlias,
			[this._followeeAliasAttr]: followeeAlias,
		};
	}

	async getPageOfFollowers(
		followeeAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]> {
		const [items, hasMore] = await this.getPage({
			TableName: this._tableName,
			IndexName: this._indexName,
			KeyConditionExpression: "#followeeAlias = :followeeAlias",
			ExpressionAttributeNames: { "#followeeAlias": this._followeeAliasAttr },
			ExpressionAttributeValues: { ":followeeAlias": followeeAlias },
			Limit: pageSize,
			ExclusiveStartKey:
				lastItem === null
					? undefined
					: {
							[this._followeeAliasAttr]: followeeAlias,
							[this._followerAliasAttr]: lastItem.alias,
						},
		});

		const followers = items.map((item) => ({
			alias: item[this._followerAliasAttr],
			firstName: "",
			lastName: "",
			imageURL: "",
		}));

		return [followers as UserDTO[], hasMore];
	}

	async getPageOfFollowerAliases(
		followeeAlias: string,
		pageSize: number,
		lastItemAlias: string | null,
	): Promise<[string[], boolean]> {
		const [items, hasMore] = await this.getPage({
			TableName: this._tableName,
			IndexName: this._indexName,
			KeyConditionExpression: "#followeeAlias = :followeeAlias",
			ExpressionAttributeNames: { "#followeeAlias": this._followeeAliasAttr },
			ExpressionAttributeValues: { ":followeeAlias": followeeAlias },
			Limit: pageSize,
			ExclusiveStartKey:
				lastItemAlias === null
					? undefined
					: {
							[this._followeeAliasAttr]: followeeAlias,
							[this._followerAliasAttr]: lastItemAlias,
						},
		});

		const followerAliases = items.map((item) => item[this._followerAliasAttr]);

		return [followerAliases, hasMore];
	}

	async getPageOfFollowees(
		followerAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]> {
		const [items, hasMore] = await this.getPage({
			TableName: this._tableName,
			KeyConditionExpression: "#followerAlias = :followerAlias",
			ExpressionAttributeNames: { "#followerAlias": this._followerAliasAttr },
			ExpressionAttributeValues: { ":followerAlias": followerAlias },
			Limit: pageSize,
			ExclusiveStartKey:
				lastItem === null
					? undefined
					: {
							[this._followerAliasAttr]: followerAlias,
							[this._followeeAliasAttr]: lastItem.alias,
						},
		});

		const followees = items.map((item) => ({
			alias: item[this._followeeAliasAttr],
			firstName: "",
			lastName: "",
			imageURL: "",
		}));

		return [followees as UserDTO[], hasMore];
	}
}
