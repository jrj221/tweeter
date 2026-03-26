import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { StatusDAO } from "../DAO";
import { DynamoDBDAO } from "./DynamoDBDAO";
import { StatusDTO } from "tweeter-shared";

export class DynamoDBStatusDAO extends DynamoDBDAO implements StatusDAO {
	private readonly _tableName = "status";
	private readonly _authorAliasAttr = "authorAlias";
	private readonly _timestampAttr = "timestamp";
	private readonly _postAttr = "post";
	private readonly _segmentsAttr = "segmentDTOs";

	async addStatus(status: StatusDTO): Promise<void> {
		const params = {
			TableName: this._tableName,
			Item: {
				[this._authorAliasAttr]: status.user.alias,
				[this._timestampAttr]: status.timestamp,
				[this._postAttr]: status.post,
				[this._segmentsAttr]: status.segments,
			},
		};
		await this._client.send(new PutCommand(params));
	}

	async getPageOfStatuses(
		userAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null,
	): Promise<[StatusDTO[], boolean]> {
		const params: any = {
			TableName: this._tableName,
			KeyConditionExpression: "#authorAlias = :authorAlias",
			ExpressionAttributeNames: { "#authorAlias": this._authorAliasAttr },
			ExpressionAttributeValues: { ":authorAlias": userAlias },
			Limit: pageSize,
			ScanIndexForward: false, // Chronological order (descending by timestamp?)
		};

		if (lastItem !== null) {
			params.ExclusiveStartKey = {
				[this._authorAliasAttr]: userAlias,
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
