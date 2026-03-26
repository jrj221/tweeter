import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { FeedDAO } from "../DAO";
import { DynamoDBDAO } from "./DynamoDBDAO";
import { StatusDTO } from "tweeter-shared";

export class DynamoDBFeedDAO extends DynamoDBDAO implements FeedDAO {
	private readonly _tableName = "feed";
	private readonly _followerAliasAttr = "followerAlias";
	private readonly _timestampAttr = "timestamp";
	private readonly _authorAliasAttr = "authorAlias";
	private readonly _postAttr = "post";
	private readonly _segmentsAttr = "segmentDTOs";

	async addFeedItem(followerAlias: string, status: StatusDTO): Promise<void> {
		const params = {
			TableName: this._tableName,
			Item: {
				[this._followerAliasAttr]: followerAlias,
				[this._timestampAttr]: status.timestamp,
				[this._authorAliasAttr]: status.user.alias,
				[this._postAttr]: status.post,
				[this._segmentsAttr]: status.segments,
			},
		};
		await this._client.send(new PutCommand(params));
	}

	async getPageOfFeedItems(
		followerAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null,
	): Promise<[StatusDTO[], boolean]> {
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
				[this._timestampAttr]: lastItem.timestamp,
			};
		}

		const output = await this._client.send(new QueryCommand(params));
		const statuses =
			output.Items?.map((item) => ({
				post: item[this._postAttr],
				timestamp: item[this._timestampAttr],
				segments: item[this._segmentsAttr],
				user: { alias: item[this._authorAliasAttr], firstName: "", lastName: "", imageURL: "" },
			})) ?? [];

		return [statuses as StatusDTO[], output.LastEvaluatedKey !== undefined];
	}
}
