import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
	updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
	navigate: NavigateFunction;
}

export class LoginPresenter extends Presenter<LoginView> {
	private userService: UserService = new UserService();
	private _isLoading: boolean = false;

	public get isLoading() {
		return this._isLoading;
	}

	public checkSubmitButtonStatus(alias: string, password: string): boolean {
		return !alias || !password;
	}

	public async doLogin(alias: string, password: string, originalUrl: string | undefined, rememberMe: boolean) {
		await this.doFailureReportingOperation(
			async () => {
				this._isLoading = true;

				const [user, authToken] = await this.userService.login(alias, password);

				this.view.updateUserInfo(user, user, authToken, rememberMe);

				if (!!originalUrl) {
					this.view.navigate(originalUrl);
				} else {
					this.view.navigate(`/feed/${user.alias}`);
				}
			},
			"log user in",
			() => {
				this._isLoading = false;
			}
		);
	}
}
