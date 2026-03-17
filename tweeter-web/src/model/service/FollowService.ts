import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class FollowService implements Service {
	public async loadMoreFollowees(
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: User | null,
	): Promise<[User[], boolean]> {
		const facade = new ServerFacade();
		return await facade.getMoreFollowees({
			token: authToken.token,
			alias: userAlias,
			pageSize: pageSize,
			lastItem: lastItem?.DTO ?? null,
		});
	}

	public async loadMoreFollowers(
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: User | null,
	): Promise<[User[], boolean]> {
		const facade = new ServerFacade();
		return await facade.getMoreFollowers({
			token: authToken.token,
			alias: userAlias,
			pageSize: pageSize,
			lastItem: lastItem?.DTO ?? null,
		});
	}

	public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
		// TODO: Replace with the result of calling server
		return FakeData.instance.isFollower();
	}

	public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
		// TODO: Replace with the result of calling server
		return FakeData.instance.getFolloweeCount(user.alias);
	}

	public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
		// TODO: Replace with the result of calling server
		return FakeData.instance.getFollowerCount(user.alias);
	}

	public async changeFollowingStatus(
		authToken: AuthToken,
		userToChangeFollowingStatusFor: User,
	): Promise<[followerCount: number, followeeCount: number]> {
		// Pause so we can see the follow message. Remove when connected to the server
		await new Promise((f) => setTimeout(f, 2000));

		// TODO: Call the server

		const followerCount = await this.getFollowerCount(authToken, userToChangeFollowingStatusFor);
		const followeeCount = await this.getFolloweeCount(authToken, userToChangeFollowingStatusFor);

		return [followerCount, followeeCount];
	}

	public follow = async (
		authToken: AuthToken,
		userToFollow: User,
	): Promise<[followerCount: number, followeeCount: number]> => {
		return await this.changeFollowingStatus(authToken, userToFollow);
	};

	public unfollow = async (
		authToken: AuthToken,
		userToUnfollow: User,
	): Promise<[followerCount: number, followeeCount: number]> => {
		return await this.changeFollowingStatus(authToken, userToUnfollow);
	};
}
