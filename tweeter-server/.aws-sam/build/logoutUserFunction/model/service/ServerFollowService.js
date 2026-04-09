"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerFollowService = void 0;
const Service_1 = require("./Service");
class ServerFollowService extends Service_1.Service {
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        return await this.getMoreItems(token, userAlias, pageSize, lastItem, (alias, limit, last) => this._daoFactory.makeFollowDAO().getPageOfFollowees(alias, limit, last), (items) => this.populateUsers(items, (item) => item.alias, Object.assign));
    }
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        return await this.getMoreItems(token, userAlias, pageSize, lastItem, (alias, limit, last) => this._daoFactory.makeFollowDAO().getPageOfFollowers(alias, limit, last), (items) => this.populateUsers(items, (item) => item.alias, Object.assign));
    }
    async loadMoreFollowerAliases(token, userAlias, pageSize, lastItemAlias, authenticate = true) {
        return await this.getMoreItems(token, userAlias, pageSize, lastItemAlias, (alias, limit, last) => this._daoFactory.makeFollowDAO().getPageOfFollowerAliases(alias, limit, last), async () => { }, authenticate);
    }
    async getIsFollowerStatus(token, userAlias, selectedUserAlias) {
        this.checkParams(token, userAlias, selectedUserAlias);
        await this.doAuthenticate(token);
        const followDAO = this._daoFactory.makeFollowDAO();
        return await followDAO.getIsFollower(userAlias, selectedUserAlias);
    }
    async getFolloweeCount(token, userAlias) {
        return this.getCount(token, userAlias, "followeeCount");
    }
    async getFollowerCount(token, userAlias) {
        return this.getCount(token, userAlias, "followerCount");
    }
    async getCount(token, userAlias, countType) {
        this.checkParams(token, userAlias);
        await this.doAuthenticate(token);
        const userDAO = this._daoFactory.makeUserDAO();
        const user = await userDAO.findUserByAlias(userAlias);
        return user?.[countType] ?? -1;
    }
    async follow(token, userAlias, userToFollowAlias) {
        return await this.doFollowAction(token, userAlias, userToFollowAlias, true);
    }
    async unfollow(token, userAlias, userToUnfollowAlias) {
        return await this.doFollowAction(token, userAlias, userToUnfollowAlias, false);
    }
    async doFollowAction(token, userAlias, targetAlias, isFollow) {
        this.checkParams(token, userAlias, targetAlias);
        await this.doAuthenticate(token);
        const followDAO = this._daoFactory.makeFollowDAO();
        const userDAO = this._daoFactory.makeUserDAO();
        if (isFollow) {
            await followDAO.addFollow(userAlias, targetAlias);
            await userDAO.updateFolloweeCount(userAlias, 1);
            await userDAO.updateFollowerCount(targetAlias, 1);
        }
        else {
            await followDAO.removeFollow(userAlias, targetAlias);
            await userDAO.updateFolloweeCount(userAlias, -1);
            await userDAO.updateFollowerCount(targetAlias, -1);
        }
        const followerCount = await this.getFollowerCount(token, targetAlias);
        const followeeCount = await this.getFolloweeCount(token, targetAlias);
        return [followerCount, followeeCount];
    }
}
exports.ServerFollowService = ServerFollowService;
