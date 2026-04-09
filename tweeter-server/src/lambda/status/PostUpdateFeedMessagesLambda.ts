import { SQSEvent } from "aws-lambda";
import { PostStatusMessage, UpdateFeedMessage } from "tweeter-shared";
import { ServerFollowService } from "../../model/service/ServerFollowService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";
import { sendSQSMessageBatch } from "./MessageQueue";

export const handler = async (event: SQSEvent) => {
	try {
		for (const record of event.Records) {
			// Based on configured batch size
			const postStatusMessage: PostStatusMessage = JSON.parse(record.body); // More typechecking?

			const followers: string[] = await getAllFollowers(postStatusMessage.followeeAlias, postStatusMessage.token);

			const url = "https://sqs.us-east-1.amazonaws.com/735980888276/UpdateFeed";
			const messages: UpdateFeedMessage[] = [];

			for (let i = 0; i < followers.length; i += 400) {
				const followersSubset = followers.slice(i, i + 400);
				const message: UpdateFeedMessage = {
					followerAliases: followersSubset,
					statusDTO: postStatusMessage.statusDTO,
					token: postStatusMessage.token,
				};
				messages.push(message);

				if (messages.length === 10) {
					await sendSQSMessageBatch(url, messages);
					messages.length = 0;
				}
			}

			if (messages.length > 0) {
				await sendSQSMessageBatch(url, messages);
			}
		}
	} catch (error) {
		console.error("Error posting update feed messages:", (error as Error).message);
		throw error;
	}
};

async function getAllFollowers(followeeAlias: string, token: string): Promise<string[]> {
	const followService = new ServerFollowService(new DynamoDBDAOFactory());
	const followers: string[] = [];

	let lastFollowerAlias: string | null = null;
	let hasMoreFollowers = true;

	while (hasMoreFollowers) {
		const [newFollowerAliases, more] = await followService.loadMoreFollowerAliases(
			token,
			followeeAlias,
			100,
			lastFollowerAlias,
			false, // Bypassing redundant authentication for background task
		);
		followers.push(...newFollowerAliases);
		hasMoreFollowers = more;
		if (newFollowerAliases.length > 0) {
			lastFollowerAlias = newFollowerAliases[newFollowerAliases.length - 1];
		}
	}

	return followers;
}
