import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class FollowService implements Service {
	private facade = new ServerFacade();

	public async loadMoreFollowees(
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: User | null,
	): Promise<[User[], boolean]> {
		return await this.facade.getMoreFollowees({
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
		return await this.facade.getMoreFollowers({
			token: authToken.token,
			alias: userAlias,
			pageSize: pageSize,
			lastItem: lastItem?.DTO ?? null,
		});
	}

	public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
		return await this.facade.getIsFollowerStatus({
			token: authToken.token,
			user: user.DTO,
			selectedUser: selectedUser.DTO,
		});
	}

	public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
		return await this.facade.getFolloweeCount({
			token: authToken.token,
			user: user.DTO,
		});
	}

	public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
		return await this.facade.getFollowerCount({
			token: authToken.token,
			user: user.DTO,
		});
	}

	public follow = async (
		authToken: AuthToken,
		user: User,
		userToFollow: User,
	): Promise<[followerCount: number, followeeCount: number]> => {
		return await this.facade.followUser({
			token: authToken.token,
			user: user.DTO,
			targetUser: userToFollow.DTO,
		});
	};

	public unfollow = async (
		authToken: AuthToken,
		user: User,
		userToUnfollow: User,
	): Promise<[followerCount: number, followeeCount: number]> => {
		return await this.facade.unfollowUser({
			token: authToken.token,
			user: user.DTO,
			targetUser: userToUnfollow.DTO,
		});
	};
}
