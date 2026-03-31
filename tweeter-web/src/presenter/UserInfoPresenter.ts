import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DisplayUserView, MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView, DisplayUserView {
	setFollowerCount: (value: number) => void;
	setFolloweeCount: (value: number) => void;
	setIsLoading: (value: boolean) => void;
	setIsFollower: (value: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
	private followService: FollowService = new FollowService();

	public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
		await this.doFailureReportingOperation(
			async () => {
				if (currentUser === displayedUser) {
					this.view.setIsFollower(false);
				} else {
					this.view.setIsFollower(
						await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
					);
				}
			},
			"determine follower status",
			() => {}
		);
	}

	public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
		await this.doFailureReportingOperation(
			async () => {
				this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
			},
			"get followees count",
			() => {}
		);
	}

	public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
		await this.doFailureReportingOperation(
			async () => {
				this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
			},
			"get followers count",
			() => {}
		);
	}

	private async changeFollowingStatusForDisplayUser(
		displayedUser: User | null,
		currentUser: User | null,
		authToken: AuthToken | null,
		following: boolean,
		followingStatusOperation: (
			authToken: AuthToken,
			currentUser: User,
			displayedUser: User
		) => Promise<[followerCount: number, followeeCount: number]>
	) {
		var followingStatusUserMessage = "";

		await this.doFailureReportingOperation(
			async () => {
				this.view.setIsLoading(true);
				followingStatusUserMessage = this.view.displayInfoMessage(
					`${following ? "Following" : "Unfollowing"} ${displayedUser!.name}...`,
					0
				);

				const [followerCount, followeeCount] = await followingStatusOperation(
					authToken!,
					currentUser!,
					displayedUser!
				);

				this.view.setIsFollower(following ? true : false);
				this.view.setFolloweeCount(followeeCount);
				this.view.setFollowerCount(followerCount);
			},
			`${following ? "follow" : "unfollow"} user`,
			() => {
				this.view.deleteMessage(followingStatusUserMessage);
				this.view.setIsLoading(false);
			}
		);
	}

	public async followDisplayedUser(
		displayedUser: User | null,
		currentUser: User | null,
		authToken: AuthToken | null
	) {
		this.changeFollowingStatusForDisplayUser(
			displayedUser,
			currentUser,
			authToken,
			true,
			this.followService.follow
		);
	}

	public async unfollowDisplayedUser(
		displayedUser: User | null,
		currentUser: User | null,
		authToken: AuthToken | null
	) {
		this.changeFollowingStatusForDisplayUser(
			displayedUser,
			currentUser,
			authToken,
			false,
			this.followService.unfollow
		);
	}

	public switchToLoggedInUser(currentUser: User | null) {
		this.view.setDisplayedUser(currentUser!);
		this.view.navigate(`${this.getBaseUrl()}/${currentUser!.alias}`);
	}

	public getBaseUrl(): string {
		const segments = location.pathname.split("/@");
		return segments.length > 1 ? segments[0] : "/";
	}
}
