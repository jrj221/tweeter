import { SQSEvent } from "aws-lambda";
import { PostStatusMessage, UpdateFeedMessage } from "tweeter-shared";
import { ServerFollowService } from "../../model/service/ServerFollowService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";
import { sendSQSMessage } from "./MessageQueue";

export const handler = async (event: SQSEvent) => {
	try {
		const factory = new DynamoDBDAOFactory();
		const followService = new ServerFollowService(factory);
		const url = "https://sqs.us-east-1.amazonaws.com/735980888276/UpdateFeed";

		for (const record of event.Records) {
			const postStatusMessage: PostStatusMessage = JSON.parse(record.body);

			let lastFollowerAlias: string | null = null;
			let hasMoreFollowers = true;

			while (hasMoreFollowers) {
				const [newFollowerAliases, more]: [string[], boolean] = await followService.loadMoreFollowerAliases(
					postStatusMessage.token,
					postStatusMessage.followeeAlias,
					100,
					lastFollowerAlias,
					false, // Bypassing redundant authentication
				);

				hasMoreFollowers = more;

				if (newFollowerAliases.length > 0) {
					lastFollowerAlias = newFollowerAliases[newFollowerAliases.length - 1];

					const message: UpdateFeedMessage = {
						followerAliases: newFollowerAliases,
						statusDTO: postStatusMessage.statusDTO,
						token: postStatusMessage.token,
					};

					await sendSQSMessage(url, message);
				}
			}
		}
	} catch (error) {
		console.error("Error posting update feed messages:", (error as Error).message);
		throw error;
	}
};
