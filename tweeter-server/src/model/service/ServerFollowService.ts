import { AuthToken, FakeData, User, UserDTO } from "tweeter-shared";
import { Service } from "./Service";

export class ServerFollowService implements Service {
	public async loadMoreFollowees(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]> {
		return this.getFakeData(lastItem, pageSize, userAlias);
	}

	public async loadMoreFollowers(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]> {
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
		return FakeData.instance.isFollower();
	}

	public async getFolloweeCount(token: string, user: UserDTO): Promise<number> {
		return FakeData.instance.getFolloweeCount(user.alias);
	}

	public async getFollowerCount(token: string, user: UserDTO): Promise<number> {
		return FakeData.instance.getFollowerCount(user.alias);
	}

	public async changeFollowingStatus(
		token: string,
		userToChangeFollowingStatusFor: UserDTO,
	): Promise<[followerCount: number, followeeCount: number]> {
		// // Pause so we can see the follow message. Remove when connected to the server
		// await new Promise((f) => setTimeout(f, 2000));

		const followerCount = await this.getFollowerCount(token, userToChangeFollowingStatusFor);
		const followeeCount = await this.getFolloweeCount(token, userToChangeFollowingStatusFor);

		return [followerCount, followeeCount];
	}

	public follow = async (
		token: string,
		userToFollow: UserDTO,
	): Promise<[followerCount: number, followeeCount: number]> => {
		return await this.changeFollowingStatus(token, userToFollow);
	};

	public unfollow = async (
		token: string,
		userToUnfollow: UserDTO,
	): Promise<[followerCount: number, followeeCount: number]> => {
		return await this.changeFollowingStatus(token, userToUnfollow);
	};
}
