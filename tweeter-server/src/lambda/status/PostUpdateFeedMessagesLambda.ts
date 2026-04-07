import { PostStatusMessage, UpdateFeedMessage, UserDTO } from "tweeter-shared";
import { ServerFollowService } from "../../model/service/ServerFollowService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";
import { sendSQSMessage } from "./MessageQueue";

export const handler = async (message: string) => {
	const postStatusMessage: PostStatusMessage = JSON.parse(message); // More typechecking?

	const followers: string[] = await getAllFollowers(postStatusMessage.followeeAlias, postStatusMessage.token);

	for (let i = 0; i < followers.length; i += 400) {
		const followersSubset = followers.slice(i, i + 400);
		const message: UpdateFeedMessage = {
			followees: followersSubset,
			statusDTO: postStatusMessage.statusDTO,
			token: postStatusMessage.token,
		};
		await sendSQSMessage("https://sqs.us-east-1.amazonaws.com/735980888276/UpdateFeed", message);
	}
};

async function getAllFollowers(followeeAlias: string, token: string): Promise<string[]> {
	const followService = new ServerFollowService(new DynamoDBDAOFactory());
	const followers: string[] = [];

	let lastFollower: UserDTO | null = null;
	let hasMoreFollowers = true;

	while (hasMoreFollowers) {
		const [newFollowers, more] = await followService.loadMoreFollowers(token, followeeAlias, 100, lastFollower);
		followers.push(...newFollowers.map((user) => user.alias));
		hasMoreFollowers = more;
		if (newFollowers.length > 0) {
			lastFollower = newFollowers[newFollowers.length - 1];
		}
	}

	return followers;
}
