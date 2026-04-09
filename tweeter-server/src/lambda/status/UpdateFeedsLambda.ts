import { SQSEvent } from "aws-lambda";
import { UpdateFeedMessage } from "tweeter-shared";
import { ServerStatusService } from "../../model/service/ServerStatusService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";

export const handler = async (event: SQSEvent) => {
	// console.log("Reached UpdateFeedLambda");
	try {
		for (const record of event.Records) {
			// console.log("In a record");
			// Based on configured batch size
			const updateFeedMessage: UpdateFeedMessage = JSON.parse(record.body); // More typechecking?

			const statusService = new ServerStatusService(new DynamoDBDAOFactory());
			for (let i = 0; i < updateFeedMessage.followerAliases.length; i += 100) {
				const startTimeMilllis = Date.now();

				for (let j = 0; j < 4; j++) {
					const followerBatch = updateFeedMessage.followerAliases.slice(i + j * 25, i + (j + 1) * 25);
					if (followerBatch.length > 0) {
						// console.log("Sending a batch feed write");
						await statusService.batchAddFeedItemsInternal(updateFeedMessage.statusDTO, followerBatch);
					}
				}

				const elapsedTimeMillis = Date.now() - startTimeMilllis;
				if (elapsedTimeMillis < 1000) {
					await new Promise((resolve) => setTimeout(resolve, 1000 - elapsedTimeMillis));
				}
			}
		}
		// console.log("finishing lambda");
	} catch (error) {
		console.error("Error updating feeds:", (error as Error).message);
		throw error;
	}
};
