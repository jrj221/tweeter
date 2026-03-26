import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export abstract class DynamoDBDAO {
	protected _client: DynamoDBDocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient());
}
