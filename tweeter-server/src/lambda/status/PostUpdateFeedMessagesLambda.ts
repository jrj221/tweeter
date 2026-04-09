import { SQSEvent } from "aws-lambda";
import { PostStatusMessage, UpdateFeedMessage, UserDTO } from "tweeter-shared";
import { ServerFollowService } from "../../model/service/ServerFollowService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";
import { sendSQSMessage } from "./MessageQueue";

export const handler = async (event: SQSEvent) => {
	try {
		for (const record of event.Records) {
			// Based on configured batch size
			const postStatusMessage: PostStatusMessage = JSON.parse(record.body); // More typechecking?

			const followers: string[] = await getAllFollowers(
				postStatusMessage.followeeAlias,
				postStatusMessage.token,
			);

			for (let i = 0; i < followers.length; i += 400) {
				const followersSubset = followers.slice(i, i + 400);
				const message: UpdateFeedMessage = {
					followerAliases: followersSubset,
					statusDTO: postStatusMessage.statusDTO,
					token: postStatusMessage.token,
				};
				await sendSQSMessage(
					"https://sqs.us-east-1.amazonaws.com/735980888276/UpdateFeed",
					message,
				);
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
		);
		followers.push(...newFollowerAliases);
		hasMoreFollowers = more;
		if (newFollowerAliases.length > 0) {
			lastFollowerAlias = newFollowerAliases[newFollowerAliases.length - 1];
		}
	}

	return followers;
}
