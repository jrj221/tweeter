import { SQSEvent } from "aws-lambda";
import { UpdateFeedMessage } from "tweeter-shared";
import { ServerStatusService } from "../../model/service/ServerStatusService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";

export const handler = async (event: SQSEvent) => {
	try {
		const statusService = new ServerStatusService(new DynamoDBDAOFactory());

		for (const record of event.Records) {
			const updateFeedMessage: UpdateFeedMessage = JSON.parse(record.body);

			// Process blocks of 100 followers in batches of 25 for DynamoDB
			for (let i = 0; i < updateFeedMessage.followerAliases.length; i += 100) {
				const startTimeMillis = Date.now();

				// Send up to 4 batches of 25 (100 total) per second to respect WCU
				for (let j = 0; j < 100 && i + j < updateFeedMessage.followerAliases.length; j += 25) {
					const followerBatch = updateFeedMessage.followerAliases.slice(i + j, i + j + 25);
					if (followerBatch.length > 0) {
						await statusService.batchAddFeedItemsInternal(updateFeedMessage.statusDTO, followerBatch);
					}
				}

				const elapsedTimeMillis = Date.now() - startTimeMillis;
				if (elapsedTimeMillis < 1000) {
					await new Promise((resolve) => setTimeout(resolve, 1000 - elapsedTimeMillis));
				}
			}
		}
	} catch (error) {
		console.error("Error updating feeds:", (error as Error).message);
		throw error;
	}
};
