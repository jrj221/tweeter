import { SQSEvent } from "aws-lambda";
import { PostStatusMessage, UpdateFeedMessage } from "tweeter-shared";
import { ServerFollowService } from "../../model/service/ServerFollowService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";
import { sendSQSMessageBatch } from "./MessageQueue";

export const handler = async (event: SQSEvent) => {
	try {
		const factory = new DynamoDBDAOFactory();
		const followService = new ServerFollowService(factory);
		const url = "https://sqs.us-east-1.amazonaws.com/735980888276/UpdateFeed";

		for (const record of event.Records) {
			const postStatusMessage: PostStatusMessage = JSON.parse(record.body);

			let lastFollowerAlias: string | null = null;
			let hasMoreFollowers = true;

			const followerBuffer: string[] = [];
			const sqsBatch: UpdateFeedMessage[] = [];

			while (hasMoreFollowers) {
				const [newFollowerAliases, more]: [string[], boolean] = await followService.loadMoreFollowerAliases(
					postStatusMessage.token,
					postStatusMessage.followeeAlias,
					100,
					lastFollowerAlias,
					false, // Bypassing redundant authentication
				);

				hasMoreFollowers = more;
				followerBuffer.push(...newFollowerAliases);

				if (newFollowerAliases.length > 0) {
					lastFollowerAlias = newFollowerAliases[newFollowerAliases.length - 1];
				}

				// Process full groups of 400 from the buffer
				while (followerBuffer.length >= 400) {
					const followersSubset = followerBuffer.splice(0, 400);
					const message: UpdateFeedMessage = {
						followerAliases: followersSubset,
						statusDTO: postStatusMessage.statusDTO,
						token: postStatusMessage.token,
					};
					sqsBatch.push(message);

					if (sqsBatch.length === 10) {
						await sendSQSMessageBatch(url, sqsBatch);
						sqsBatch.length = 0;
					}
				}
			}

			// After all pages for this record, handle leftovers
			if (followerBuffer.length > 0) {
				const message: UpdateFeedMessage = {
					followerAliases: followerBuffer,
					statusDTO: postStatusMessage.statusDTO,
					token: postStatusMessage.token,
				};
				sqsBatch.push(message);
			}

			if (sqsBatch.length > 0) {
				await sendSQSMessageBatch(url, sqsBatch);
			}
		}
	} catch (error) {
		console.error("Error posting update feed messages:", (error as Error).message);
		throw error;
	}
};
