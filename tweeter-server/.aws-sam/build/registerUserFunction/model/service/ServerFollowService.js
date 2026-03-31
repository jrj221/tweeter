"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerFollowService = void 0;
const Service_1 = require("./Service");
class ServerFollowService extends Service_1.Service {
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        this.checkParams(token, userAlias, pageSize);
        await this.doAuthenticate(token);
        const followDAO = this._daoFactory.makeFollowDAO();
        const [dtos, hasMore] = await followDAO.getPageOfFollowees(userAlias, pageSize, lastItem);
        await this.populateUserDetails(dtos);
        return [dtos, hasMore];
    }
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        this.checkParams(token, userAlias, pageSize);
        await this.doAuthenticate(token);
        const followDAO = this._daoFactory.makeFollowDAO();
        const [dtos, hasMore] = await followDAO.getPageOfFollowers(userAlias, pageSize, lastItem);
        await this.populateUserDetails(dtos);
        return [dtos, hasMore];
    }
    async populateUserDetails(dtos) {
        const userDAO = this._daoFactory.makeUserDAO();
        for (const dto of dtos) {
            const user = await userDAO.findUserByAlias(dto.alias);
            if (user) {
                Object.assign(dto, {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    alias: user.alias,
                    imageURL: user.imageURL,
                });
            }
        }
    }
    async getIsFollowerStatus(token, userAlias, selectedUserAlias) {
        this.checkParams(token, userAlias, selectedUserAlias);
        await this.doAuthenticate(token);
        const followDAO = this._daoFactory.makeFollowDAO();
        return await followDAO.getIsFollower(userAlias, selectedUserAlias);
    }
    async getFolloweeCount(token, userAlias) {
        this.checkParams(token, userAlias);
        await this.doAuthenticate(token);
        const userDAO = this._daoFactory.makeUserDAO();
        const user = await userDAO.findUserByAlias(userAlias);
        return user?.followeeCount ?? 0;
    }
    async getFollowerCount(token, userAlias) {
        this.checkParams(token, userAlias);
        await this.doAuthenticate(token);
        const userDAO = this._daoFactory.makeUserDAO();
        const user = await userDAO.findUserByAlias(userAlias);
        return user?.followerCount ?? 0;
    }
    async follow(token, userAlias, userToFollowAlias) {
        this.checkParams(token, userAlias, userToFollowAlias);
        await this.doAuthenticate(token);
        const followDAO = this._daoFactory.makeFollowDAO();
        const userDAO = this._daoFactory.makeUserDAO();
        await followDAO.addFollow(userAlias, userToFollowAlias);
        await userDAO.updateFolloweeCount(userAlias, 1);
        await userDAO.updateFollowerCount(userToFollowAlias, 1);
        const followerCount = await this.getFollowerCount(token, userToFollowAlias);
        const followeeCount = await this.getFolloweeCount(token, userAlias);
        return [followerCount, followeeCount];
    }
    async unfollow(token, userAlias, userToUnfollowAlias) {
        this.checkParams(token, userAlias, userToUnfollowAlias);
        await this.doAuthenticate(token);
        const followDAO = this._daoFactory.makeFollowDAO();
        const userDAO = this._daoFactory.makeUserDAO();
        await followDAO.removeFollow(userAlias, userToUnfollowAlias);
        await userDAO.updateFolloweeCount(userAlias, -1);
        await userDAO.updateFollowerCount(userToUnfollowAlias, -1);
        const followerCount = await this.getFollowerCount(token, userToUnfollowAlias);
        const followeeCount = await this.getFolloweeCount(token, userAlias);
        return [followerCount, followeeCount];
    }
}
exports.ServerFollowService = ServerFollowService;
