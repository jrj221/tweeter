import { StatusDTO, UserDTO } from "tweeter-shared";

export interface UserDAO {
	findUserByAlias(alias: string): Promise<{
		firstName: string;
		lastName: string;
		alias: string;
		imageURL: string;
		passwordHash: string;
		followerCount: number;
		followeeCount: number;
	} | null>;
	addUser(firstName: string, lastName: string, alias: string, passwordHash: string, imageURL: string): Promise<void>;
	updateFollowerCount(alias: string, count: number): Promise<void>;
	updateFolloweeCount(alias: string, count: number): Promise<void>;
}

export interface StatusDAO {
	addStatus(status: StatusDTO): Promise<void>;
	getPageOfStatuses(userAlias: string, pageSize: number, lastItem: StatusDTO | null): Promise<[StatusDTO[], boolean]>;
}

export interface FollowDAO {
	addFollow(followerAlias: string, followeeAlias: string): Promise<void>;
	removeFollow(followerAlias: string, followeeAlias: string): Promise<void>;
	getIsFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
	getPageOfFollowers(
		followeeAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]>;
	getPageOfFollowees(
		followerAlias: string,
		pageSize: number,
		lastItem: UserDTO | null,
	): Promise<[UserDTO[], boolean]>;
}

export interface FeedDAO {
	addFeedItem(followerAlias: string, status: StatusDTO): Promise<void>;
	getPageOfFeedItems(
		followerAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null,
	): Promise<[StatusDTO[], boolean]>;
}

export interface AuthTokenDAO {
	getAuthorizedTime(token: string): Promise<number | null>;
	updateAuthorizedTime(token: string): Promise<void>;
	addAuthToken(token: string, userAlias: string, expiresAt: number): Promise<void>;
	removeAuthToken(token: string): Promise<void>;
}

export interface ImageDAO {
	putImage(filename: string, imageStringBase64Encoded: string): Promise<string>;
}
