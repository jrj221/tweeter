import { User, AuthToken } from "tweeter-shared";
import { AuthenticationView, Presenter } from "./Presenter";

export class AuthenticationPresenter<T extends AuthenticationView> extends Presenter<T> {
	private _isLoading: boolean = false;

	public get isLoading() {
		return this._isLoading;
	}

	protected async doAuthenticate(
		rememberMe: boolean,
		authenticateOperation: () => Promise<[User, AuthToken]>,
		navigateOperation: (user: User) => void,
		authenticationDescription: string
	) {
		await this.doFailureReportingOperation(
			async () => {
				this._isLoading = true;

				const [user, authToken] = await authenticateOperation();

				this.view.updateUserInfo(user, user, authToken, rememberMe);

				navigateOperation(user);
			},
			authenticationDescription,
			() => {
				this._isLoading = false;
			}
		);
	}
}
