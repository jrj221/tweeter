import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { NavigateFunction } from "react-router-dom";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageID: string) => void;
  navigate: NavigateFunction;
  setDisplayedUser: (user: User) => void;
  setFollowerCount: (value: number) => void;
  setFolloweeCount: (value: number) => void;
  setIsLoading: (value: boolean) => void;
  setIsFollower: (value: boolean) => void;
}

export class UserInfoPresenter {
  private _view: UserInfoView;
  private followService: FollowService;

  public constructor(view: UserInfoView) {
    this._view = view;
    this.followService = new FollowService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this._view.setIsFollower(false);
      } else {
        this._view.setIsFollower(await this.followService.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        ));
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {

      this._view.setFolloweeCount(await this.followService.getFolloweeCount(
        authToken,
        displayedUser
      ));
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this._view.setFollowerCount(await this.followService.getFollowerCount(
        authToken,
        displayedUser
      ));
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public async unfollowDisplayedUser(
    displayedUser: User | null,
    authToken: AuthToken | null,
  ) {
    var unfollowingUserMessage = "";

    try {
      this._view.setIsLoading(true);
      unfollowingUserMessage = this._view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.followService.unfollow(
        authToken!,
        displayedUser!
      );

      this._view.setIsFollower(false);
      this._view.setFolloweeCount(followeeCount);
      this._view.setFollowerCount(followerCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this._view.deleteMessage(unfollowingUserMessage);
      this._view.setIsLoading(false);
    }
  }

  public async followDisplayedUser(
    displayedUser: User | null,
    authToken: AuthToken | null
  ) {
    var followingUserMessage = "";

    try {
      this._view.setIsLoading(true);
      followingUserMessage = this._view.displayInfoMessage(
        `Following ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.followService.follow(
        authToken!,
        displayedUser!
      );

      this._view.setIsFollower(true);
      this._view.setFolloweeCount(followeeCount);
      this._view.setFollowerCount(followerCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this._view.deleteMessage(followingUserMessage);
      this._view.setIsLoading(false);
    }
  }

  public switchToLoggedInUser(currentUser: User | null) {
    this._view.setDisplayedUser(currentUser!);
    this._view.navigate(`${this.getBaseUrl()}/${currentUser!.alias}`);
  }

  public getBaseUrl(): string {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  }
}
