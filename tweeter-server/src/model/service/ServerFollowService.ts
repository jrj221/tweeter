import { AuthToken, User, FakeData, UserDTO } from "tweeter-shared";
import { Service } from "./Service";

export class ServerFollowService implements Service {
	public async loadMoreFollowees(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]> {
		// TODO: Replace with the result of calling server
		return this.getFakeData(lastItem, pageSize, userAlias);
	}

	public async loadMoreFollowers(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]> {
		// TODO: Replace with the result of calling server
		return this.getFakeData(lastItem, pageSize, userAlias);
	}

	private async getFakeData(
		lastItem: UserDTO | null,
		pageSize: number,
		userAlias: string,
	): Promise<[UserDTO[], boolean]> {
		const [items, hasMoreItems] = FakeData.instance.getPageOfUsers(User.fromDTO(lastItem), pageSize, userAlias);
		const dtos = items.map((user) => user.DTO);
		return [dtos, hasMoreItems];
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
