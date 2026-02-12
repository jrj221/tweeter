import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { NavigateFunction } from "react-router-dom";


export interface LoginView {
    displayErrorMessage: (message: string) => void
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void
    navigate: NavigateFunction
}

export class LoginPresenter {
  private userService: UserService;
  private _isLoading: boolean;
  private _view: LoginView;

  public constructor(view: LoginView) {
    this.userService = new UserService();
    this._isLoading = false;
    this._view = view;
  }

  public get isLoading() {
    return this._isLoading;
  }

  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  };

  public async doLogin(alias: string, password: string, originalUrl: string | undefined, rememberMe: boolean) {
    try {
      this._isLoading = true;

      const [user, authToken] = await this.userService.login(alias, password);

      this._view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this._view.navigate(originalUrl);
      } else {
        this._view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this._isLoading = false;
    }
  };
}
