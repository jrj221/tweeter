"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerStatusService = void 0;
const Service_1 = require("./Service");
class ServerStatusService extends Service_1.Service {
    async loadMoreFeedItems(token, userAlias, pageSize, lastItem) {
        this.checkParams(token, userAlias, pageSize);
        await this.doAuthenticate(token);
        const feedDAO = this._daoFactory.makeFeedDAO();
        const [dtos, hasMore] = await feedDAO.getPageOfFeedItems(userAlias, pageSize, lastItem);
        await this.populateUserDTOs(dtos);
        return [dtos, hasMore];
    }
    async loadMoreStoryItems(token, userAlias, pageSize, lastItem) {
        this.checkParams(token, userAlias, pageSize);
        await this.doAuthenticate(token);
        const statusDAO = this._daoFactory.makeStatusDAO();
        const [dtos, hasMore] = await statusDAO.getPageOfStatuses(userAlias, pageSize, lastItem);
        await this.populateUserDTOs(dtos);
        return [dtos, hasMore];
    }
    async populateUserDTOs(dtos) {
        const userDAO = this._daoFactory.makeUserDAO();
        for (const dto of dtos) {
            const user = await userDAO.findUserByAlias(dto.user.alias);
            if (user) {
                dto.user = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    alias: user.alias,
                    imageURL: user.imageURL,
                };
            }
        }
    }
    async postStatus(token, newStatus) {
        this.checkParams(token, newStatus);
        await this.doAuthenticate(token);
        const statusDTO = newStatus.DTO;
        const statusDAO = this._daoFactory.makeStatusDAO();
        await statusDAO.addStatus(statusDTO);
        const followDAO = this._daoFactory.makeFollowDAO();
        const feedDAO = this._daoFactory.makeFeedDAO();
        let lastFollower = null;
        let hasMoreFollowers = true;
        while (hasMoreFollowers) {
            const [followers, more] = await followDAO.getPageOfFollowers(statusDTO.user.alias, 100, lastFollower);
            for (const follower of followers) {
                await feedDAO.addFeedItem(follower.alias, statusDTO);
            }
            hasMoreFollowers = more;
            if (followers.length > 0) {
                lastFollower = followers[followers.length - 1];
            }
        }
    }
}
exports.ServerStatusService = ServerStatusService;
