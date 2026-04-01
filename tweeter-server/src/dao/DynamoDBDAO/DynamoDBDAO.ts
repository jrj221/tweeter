import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

export abstract class DynamoDBDAO {
	protected _client: DynamoDBDocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient());

	protected async getPage(
		params: {
			TableName: string;
			IndexName?: string;
			KeyConditionExpression: string;
			ExpressionAttributeNames: Record<string, string>;
			ExpressionAttributeValues: Record<string, any>;
			Limit: number;
			ScanIndexForward?: boolean;
			ExclusiveStartKey?: Record<string, any>;
		}
	): Promise<[any[], boolean]> {
		const output = await this._client.send(new QueryCommand(params));
		return [output.Items ?? [], output.LastEvaluatedKey !== undefined];
	}
}
