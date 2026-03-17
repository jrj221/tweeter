"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerStatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class ServerStatusService {
    async loadMoreFeedItems(token, userAlias, pageSize, lastItem) {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize);
    }
    async loadMoreStoryItems(token, userAlias, pageSize, lastItem) {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize);
    }
    async getFakeData(lastItem, pageSize) {
        const [items, hasMoreItems] = tweeter_shared_1.FakeData.instance.getPageOfStatuses(tweeter_shared_1.Status.fromDTO(lastItem), pageSize);
        const dtos = items.map((status) => status.DTO);
        return [dtos, hasMoreItems];
    }
    async postStatus(token, newStatus) {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server to post the status
    }
}
exports.ServerStatusService = ServerStatusService;
