import { SQSEvent } from "aws-lambda";
import { UpdateFeedMessage } from "tweeter-shared";
import { ServerStatusService } from "../../model/service/ServerStatusService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";

export const handler = async (event: SQSEvent) => {
	if (event.Records.length > 0) {
		const record = event.Records[0];
		// Based on configured batch size
		const updateFeedMessage: UpdateFeedMessage = JSON.parse(record.body); // More typechecking?

		const statusService = new ServerStatusService(new DynamoDBDAOFactory());
		for (let i = 0; i < updateFeedMessage.followees.length; i += 100) {
			const startTimeMilllis = Date.now();

			for (let j = 0; j < 4; j++) {
				const followerBatch = updateFeedMessage.followees.slice(i + j * 25, i + (j + 1) * 25);
				await statusService.batchAddFeedItems(
					updateFeedMessage.token,
					updateFeedMessage.statusDTO,
					followerBatch,
				);
			}

			const elapsedTimeMillis = Date.now() - startTimeMilllis;
			if (elapsedTimeMillis < 1000) {
				await new Promise((resolve) => setTimeout(resolve, 1000 - elapsedTimeMillis));
			}
		}
	}
};
