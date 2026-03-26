import { DAOFactory } from "../DAOFactory";
import { DynamoDBAuthTokenDAO } from "./DynamoDBAuthTokenDAO";
import { DynamoDBFeedDAO } from "./DynamoDBFeedDAO";
import { DynamoDBFollowDAO } from "./DynamoDBFollowDAO";
import { DynamoDBStatusDAO } from "./DynamoDBStatusDAO";
import { DynamoDBUserDAO } from "./DynamoDBUserDAO";

export class DynamoDBDAOFactory implements DAOFactory {
	private readonly _authTokenDAO: DynamoDBAuthTokenDAO = new DynamoDBAuthTokenDAO();
	private readonly _feedDAO: DynamoDBFeedDAO = new DynamoDBFeedDAO();
	private readonly _followDAO: DynamoDBFollowDAO = new DynamoDBFollowDAO();
	private readonly _statusDAO: DynamoDBStatusDAO = new DynamoDBStatusDAO();
	private readonly _userDAO: DynamoDBUserDAO = new DynamoDBUserDAO();

	makeAuthTokenDAO(): DynamoDBAuthTokenDAO {
		return this._authTokenDAO;
	}
	makeFeedDAO(): DynamoDBFeedDAO {
		return this._feedDAO;
	}
	makeFollowDAO(): DynamoDBFollowDAO {
		return this._followDAO;
	}
	makeStatusDAO(): DynamoDBStatusDAO {
		return this._statusDAO;
	}
	makeUserDAO(): DynamoDBUserDAO {
		return this._userDAO;
	}
}
