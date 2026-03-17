"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerFollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class ServerFollowService {
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
    }
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
    }
    async getFakeData(lastItem, pageSize, userAlias) {
        const [items, hasMoreItems] = tweeter_shared_1.FakeData.instance.getPageOfUsers(tweeter_shared_1.User.fromDTO(lastItem), pageSize, userAlias);
        const dtos = items.map((user) => user.DTO);
        return [dtos, hasMoreItems];
    }
    async getIsFollowerStatus(authToken, user, selectedUser) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.isFollower();
    }
    async getFolloweeCount(token, user) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.getFolloweeCount(user.alias);
    }
    async getFollowerCount(token, user) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.getFollowerCount(user.alias);
    }
    async changeFollowingStatus(token, userToChangeFollowingStatusFor) {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server
        const followerCount = await this.getFollowerCount(token, userToChangeFollowingStatusFor);
        const followeeCount = await this.getFolloweeCount(token, userToChangeFollowingStatusFor);
        return [followerCount, followeeCount];
    }
    follow = async (token, userToFollow) => {
        return await this.changeFollowingStatus(token, userToFollow);
    };
    unfollow = async (token, userToUnfollow) => {
        return await this.changeFollowingStatus(token, userToUnfollow);
    };
}
exports.ServerFollowService = ServerFollowService;
