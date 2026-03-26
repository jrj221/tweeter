import { AuthTokenDAO, FeedDAO, FollowDAO, StatusDAO, UserDAO } from "./DAO";

export interface Factory {
	makeUserDAO(): UserDAO;
	makeStatusDAO(): StatusDAO;
	makeFollowDAO(): FollowDAO;
	makeFeedDAO(): FeedDAO;
	makeAuthTokenDAO(): AuthTokenDAO;
}
