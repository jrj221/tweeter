import { FakeData, UserDTO } from "tweeter-shared";
import { Service } from "./Service";

export class ServerFollowService extends Service {
	public async loadMoreFollowees(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]> {
		this.checkParams(token, userAlias, pageSize);
		await this.doAuthenticate(token);
		const followDAO = this._daoFactory.makeFollowDAO();
		const [dtos, hasMore] = await followDAO.getPageOfFollowees(userAlias, pageSize, lastItem);
		await this.populateUserDetails(dtos);
		return [dtos, hasMore];
	}

	public async loadMoreFollowers(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]> {
		this.checkParams(token, userAlias, pageSize);
		await this.doAuthenticate(token);
		const followDAO = this._daoFactory.makeFollowDAO();
		const [dtos, hasMore] = await followDAO.getPageOfFollowers(userAlias, pageSize, lastItem);
		await this.populateUserDetails(dtos);
		return [dtos, hasMore];
	}

	private async populateUserDetails(dtos: UserDTO[]) {
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

	public async getIsFollowerStatus(token: string, userAlias: string, selectedUserAlias: string): Promise<boolean> {
		this.checkParams(token, userAlias, selectedUserAlias);
		await this.doAuthenticate(token);
		const followDAO = this._daoFactory.makeFollowDAO();
		return await followDAO.getIsFollower(userAlias, selectedUserAlias);
	}

	public async getFolloweeCount(token: string, userAlias: string): Promise<number> {
		this.checkParams(token, userAlias);
		await this.doAuthenticate(token);
		const userDAO = this._daoFactory.makeUserDAO();
		const user = await userDAO.findUserByAlias(userAlias);
		return user?.followeeCount ?? 0;
	}

	public async getFollowerCount(token: string, userAlias: string): Promise<number> {
		this.checkParams(token, userAlias);
		await this.doAuthenticate(token);
		const userDAO = this._daoFactory.makeUserDAO();
		const user = await userDAO.findUserByAlias(userAlias);
		return user?.followerCount ?? 0;
	}

	public async follow(
		token: string,
		userAlias: string,
		userToFollowAlias: string,
	): Promise<[followerCount: number, followeeCount: number]> {
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

	public async unfollow(
		token: string,
		userAlias: string,
		userToUnfollowAlias: string,
	): Promise<[followerCount: number, followeeCount: number]> {
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
