import { FakeData, UserDTO } from "tweeter-shared";
import { Service } from "./Service";

export class ServerFollowService extends Service {
	public async loadMoreFollowees(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]> {
		return await this.getMoreItems(
			token,
			userAlias,
			pageSize,
			lastItem,
			(alias, limit, last) => this._daoFactory.makeFollowDAO().getPageOfFollowees(alias, limit, last),
			(items) => this.populateUsers(items, (item) => item.alias, Object.assign),
		);
	}

	public async loadMoreFollowers(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]> {
		return await this.getMoreItems(
			token,
			userAlias,
			pageSize,
			lastItem,
			(alias, limit, last) => this._daoFactory.makeFollowDAO().getPageOfFollowers(alias, limit, last),
			(items) => this.populateUsers(items, (item) => item.alias, Object.assign),
		);
	}

	public async getIsFollowerStatus(token: string, userAlias: string, selectedUserAlias: string): Promise<boolean> {
		this.checkParams(token, userAlias, selectedUserAlias);
		await this.doAuthenticate(token);
		const followDAO = this._daoFactory.makeFollowDAO();
		return await followDAO.getIsFollower(userAlias, selectedUserAlias);
	}

	public async getFolloweeCount(token: string, userAlias: string): Promise<number> {
		return this.getCount(token, userAlias, "followeeCount");
	}

	public async getFollowerCount(token: string, userAlias: string): Promise<number> {
		return this.getCount(token, userAlias, "followerCount");
	}

	private async getCount(
		token: string,
		userAlias: string,
		countType: "followerCount" | "followeeCount",
	): Promise<number> {
		this.checkParams(token, userAlias);
		await this.doAuthenticate(token);
		const userDAO = this._daoFactory.makeUserDAO();
		const user = await userDAO.findUserByAlias(userAlias);
		return user?.[countType] ?? -1;
	}

	public async follow(
		token: string,
		userAlias: string,
		userToFollowAlias: string,
	): Promise<[followerCount: number, followeeCount: number]> {
		return await this.doFollowAction(token, userAlias, userToFollowAlias, true);
	}

	public async unfollow(
		token: string,
		userAlias: string,
		userToUnfollowAlias: string,
	): Promise<[followerCount: number, followeeCount: number]> {
		return await this.doFollowAction(token, userAlias, userToUnfollowAlias, false);
	}

	private async doFollowAction(
		token: string,
		userAlias: string,
		targetAlias: string,
		isFollow: boolean,
	): Promise<[followerCount: number, followeeCount: number]> {
		this.checkParams(token, userAlias, targetAlias);
		await this.doAuthenticate(token);

		const followDAO = this._daoFactory.makeFollowDAO();
		const userDAO = this._daoFactory.makeUserDAO();

		if (isFollow) {
			await followDAO.addFollow(userAlias, targetAlias);
			await userDAO.updateFolloweeCount(userAlias, 1);
			await userDAO.updateFollowerCount(targetAlias, 1);
		} else {
			await followDAO.removeFollow(userAlias, targetAlias);
			await userDAO.updateFolloweeCount(userAlias, -1);
			await userDAO.updateFollowerCount(targetAlias, -1);
		}

		const followerCount = await this.getFollowerCount(token, targetAlias);
		const followeeCount = await this.getFolloweeCount(token, targetAlias);

		return [followerCount, followeeCount];
	}
}
