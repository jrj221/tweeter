import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { UserService } from "../model.service/UserService";
import { NavigateFunction } from "react-router-dom";
import { User } from "tweeter-shared";

export interface UserNavigationView {
  displayErrorMessage: (message: string) => void;
  navigate: NavigateFunction;
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter {
  private _view: UserNavigationView;
  private userService: UserService;

  public constructor(view: UserNavigationView) {
    this._view = view;
    this.userService = new UserService();
  }

  private extractAlias(value: string) {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async navigateToUser(
    eventString: string,
    authToken: AuthToken | null,
    displayedUser: User | null
  ) {
    try {
      const alias = this.extractAlias(eventString);

      const toUser = await this.userService.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this._view.setDisplayedUser(toUser);
          const regex = /\/([^\/]+)\/@/; // should match with "feed" in http://localhost5173/feed/@amy
          const featureUrl = "/" + eventString.match(regex)![1];

          //   console.log("event: " + event.target.toString());
          //   console.log("captured: " + featureUrl);

          this._view.navigate(`${featureUrl}/${toUser.alias}`);
        }
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }
}
