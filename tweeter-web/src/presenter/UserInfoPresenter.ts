import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { NavigateFunction } from "react-router-dom";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageID: string) => void,
  navigate: NavigateFunction;
  setDisplayedUser: (user: User) => void;
}

export class UserInfoPresenter {
  private _view: UserInfoView;
  private followService: FollowService;
  private _isFollower: boolean;
  private _followeeCount: number;
  private _followerCount: number;
  private _isLoading: boolean;

  public constructor(view: UserInfoView) {
    this._view = view;
    this.followService = new FollowService();
    this._isFollower = false;
    this._followeeCount = -1;
    this._followerCount = -1;
    this._isLoading = false;
  }

  public get isFollower() {
    return this._isFollower;
  }

  public get followerCount() {
    return this._followerCount;
  }

  public get followeeCount() {
    return this._followeeCount;
  }

  public get isLoading() {
    return this._isLoading;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this._isFollower = false;
      } else {
        this._isFollower = (
          await this.followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees (authToken: AuthToken, displayedUser: User) {
    try {
      this._followeeCount = await this.followService.getFolloweeCount(authToken, displayedUser);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  };

  public async setNumbFollowers (
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this._followerCount = await this.followService.getFollowerCount(authToken, displayedUser);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`,
      );
    }
  };

  public async follow (
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.followService.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.followService.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  };

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.followService.getFollowerCount(authToken, userToUnfollow);
    const followeeCount = await this.followService.getFolloweeCount(authToken, userToUnfollow);

    return [followerCount, followeeCount];
  };

  public async unfollowDisplayedUser(displayedUser: User | null, authToken: AuthToken | null) {
    var unfollowingUserMessage = "";

    try {
      this._isLoading = true;
      unfollowingUserMessage = this._view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.unfollow(
        authToken!,
        displayedUser!
      );

      this._isFollower = false;
      this._followerCount = followerCount;
      this._followeeCount = followeeCount;
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`,
      );
    } finally {
      this._view.deleteMessage(unfollowingUserMessage);
      this._isLoading = false;
    }
  }

  public async followDisplayedUser(displayedUser: User | null, authToken: AuthToken | null) {
    var followingUserMessage = "";

    try {
      this._isLoading = true;
      followingUserMessage = this._view.displayInfoMessage(
        `Following ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.follow(
        authToken!,
        displayedUser!
      );

      this._isFollower = true;
      this._followerCount = followerCount;
      this._followeeCount = followeeCount;
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`,
      );
    } finally {
      this._view.deleteMessage(followingUserMessage);
      this._isLoading = false;
    }
  }

  public switchToLoggedInUser(currentUser: User | null) {
    this._view.setDisplayedUser(currentUser!);
    this._view.navigate(`${this.getBaseUrl()}/${currentUser!.alias}`);
  }

  public getBaseUrl(): string {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };
}
