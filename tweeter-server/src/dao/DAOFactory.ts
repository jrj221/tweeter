import { AuthTokenDAO, FeedDAO, FollowDAO, StatusDAO, UserDAO } from "./DAO";

export interface DAOFactory {
	makeUserDAO(): UserDAO;
	makeStatusDAO(): StatusDAO;
	makeFollowDAO(): FollowDAO;
	makeFeedDAO(): FeedDAO;
	makeAuthTokenDAO(): AuthTokenDAO;
}
