import { DAOFactory } from "../DAOFactory";
import { DynamoDBAuthTokenDAO } from "./DynamoDBAuthTokenDAO";
import { DynamoDBFeedDAO } from "./DynamoDBFeedDAO";
import { DynamoDBFollowDAO } from "./DynamoDBFollowDAO";
import { DynamoDBStatusDAO } from "./DynamoDBStatusDAO";
import { DynamoDBUserDAO } from "./DynamoDBUserDAO";

export class DynamoDBDAOFactory implements DAOFactory {
	makeAuthTokenDAO(): DynamoDBAuthTokenDAO {
		return new DynamoDBAuthTokenDAO();
	}
	makeFeedDAO(): DynamoDBFeedDAO {
		return new DynamoDBFeedDAO();
	}
	makeFollowDAO(): DynamoDBFollowDAO {
		return new DynamoDBFollowDAO();
	}
	makeStatusDAO(): DynamoDBStatusDAO {
		return new DynamoDBStatusDAO();
	}
	makeUserDAO(): DynamoDBUserDAO {
		return new DynamoDBUserDAO();
	}
}
