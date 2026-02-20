import { UserService } from "../model.service/UserService";
import { AuthenticationPresenter } from "./AuthenticationPresenter";
import { AuthenticationView, Presenter } from "./Presenter";

export interface LoginView extends AuthenticationView {}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
	private userService: UserService = new UserService();

	public checkSubmitButtonStatus(alias: string, password: string): boolean {
		return !alias || !password;
	}

	public async doLogin(alias: string, password: string, originalUrl: string | undefined, rememberMe: boolean) {
		this.doAuthenticate(
			rememberMe,
			() => {
				return this.userService.login(alias, password);
			},
			(user) => {
				if (!!originalUrl) {
					this.view.navigate(originalUrl);
				} else {
					this.view.navigate(`/feed/${user.alias}`);
				}
			},
			"log user in"
		);
	}
}
