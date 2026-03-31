import { AuthTokenDAO, FeedDAO, FollowDAO, ImageDAO, StatusDAO, UserDAO } from "./DAO";

export interface DAOFactory {
	makeUserDAO(): UserDAO;
	makeStatusDAO(): StatusDAO;
	makeFollowDAO(): FollowDAO;
	makeFeedDAO(): FeedDAO;
	makeAuthTokenDAO(): AuthTokenDAO;
	makeImageDAO(): ImageDAO;
}
