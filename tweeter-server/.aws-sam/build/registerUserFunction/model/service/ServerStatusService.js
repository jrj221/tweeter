"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerStatusService = void 0;
const Service_1 = require("./Service");
class ServerStatusService extends Service_1.Service {
    async loadMoreFeedItems(token, userAlias, pageSize, lastItem) {
        return await this.getMoreItems(token, userAlias, pageSize, lastItem, (alias, limit, last) => this._daoFactory.makeFeedDAO().getPageOfFeedItems(alias, limit, last), (items) => this.populateUsers(items, (item) => item.user.alias, (item, user) => Object.assign(item, { user })));
    }
    async loadMoreStoryItems(token, userAlias, pageSize, lastItem) {
        return await this.getMoreItems(token, userAlias, pageSize, lastItem, (alias, limit, last) => this._daoFactory.makeStatusDAO().getPageOfStatuses(alias, limit, last), (items) => this.populateUsers(items, (item) => item.user.alias, (item, user) => Object.assign(item, { user })));
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
