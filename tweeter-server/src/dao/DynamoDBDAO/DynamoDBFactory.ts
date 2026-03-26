import { AuthTokenDAO, FeedDAO, FollowDAO, StatusDAO, UserDAO } from "../DAO";
import { Factory } from "../Factory";
import { DynamoDBAuthTokenDAO } from "./DynamoDBAuthTokenDAO";
import { DynamoDBFeedDAO } from "./DynamoDBFeedDAO";
import { DynamoDBFollowDAO } from "./DynamoDBFollowDAO";
import { DynamoDBStatusDAO } from "./DynamoDBStatusDAO";
import { DynamoDBUserDAO } from "./DynamoDBUserDAO";

export class DynamoDBFactory implements Factory {
	makeAuthTokenDAO(): AuthTokenDAO {
		return new DynamoDBAuthTokenDAO();
	}
	makeFeedDAO(): FeedDAO {
		return new DynamoDBFeedDAO();
	}
	makeFollowDAO(): FollowDAO {
		return new DynamoDBFollowDAO();
	}
	makeStatusDAO(): StatusDAO {
		return new DynamoDBStatusDAO();
	}
	makeUserDAO(): UserDAO {
		return new DynamoDBUserDAO();
	}
}
