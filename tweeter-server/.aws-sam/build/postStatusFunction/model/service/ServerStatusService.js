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
    async addStory(token, newStatus, authenticate = true) {
        this.checkParams(token, newStatus);
        if (authenticate) {
            await this.doAuthenticate(token);
        }
        const statusDTO = newStatus.DTO;
        const statusDAO = this._daoFactory.makeStatusDAO();
        await statusDAO.addStatus(statusDTO);
    }
    async addFeedItem(token, newStatus, followerAlias) {
        this.checkParams(token, newStatus);
        await this.doAuthenticate(token);
        const feedDAO = this._daoFactory.makeFeedDAO();
        await feedDAO.addFeedItem(followerAlias, newStatus);
    }
    // Doesn't require authentication because you already authenticated when you posted
    async batchAddFeedItemsInternal(newStatus, followerAliases) {
        const feedDAO = this._daoFactory.makeFeedDAO();
        await feedDAO.batchAddFeedItems(followerAliases, newStatus);
    }
}
exports.ServerStatusService = ServerStatusService;
