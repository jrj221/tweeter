"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBDAOFactory = void 0;
const S3ImageDAO_1 = require("../S3/S3ImageDAO");
const DynamoDBAuthTokenDAO_1 = require("./DynamoDBAuthTokenDAO");
const DynamoDBFeedDAO_1 = require("./DynamoDBFeedDAO");
const DynamoDBFollowDAO_1 = require("./DynamoDBFollowDAO");
const DynamoDBStatusDAO_1 = require("./DynamoDBStatusDAO");
const DynamoDBUserDAO_1 = require("./DynamoDBUserDAO");
class DynamoDBDAOFactory {
    _authTokenDAO = new DynamoDBAuthTokenDAO_1.DynamoDBAuthTokenDAO();
    _feedDAO = new DynamoDBFeedDAO_1.DynamoDBFeedDAO();
    _followDAO = new DynamoDBFollowDAO_1.DynamoDBFollowDAO();
    _statusDAO = new DynamoDBStatusDAO_1.DynamoDBStatusDAO();
    _userDAO = new DynamoDBUserDAO_1.DynamoDBUserDAO();
    _imageDAO = new S3ImageDAO_1.S3ImageDAO();
    makeAuthTokenDAO() {
        return this._authTokenDAO;
    }
    makeFeedDAO() {
        return this._feedDAO;
    }
    makeFollowDAO() {
        return this._followDAO;
    }
    makeStatusDAO() {
        return this._statusDAO;
    }
    makeUserDAO() {
        return this._userDAO;
    }
    makeImageDAO() {
        return this._imageDAO;
    }
}
exports.DynamoDBDAOFactory = DynamoDBDAOFactory;
