import { UserDTO } from "tweeter-shared";

export interface UserDAO {
	findUserByAlias(alias: string): Promise<UserDTO | null>; // What if other implementations weren't asynchronous?
}

export interface StatusDAO {}

export interface FollowDAO {}

export interface FeedDAO {}

export interface AuthTokenDAO {}
