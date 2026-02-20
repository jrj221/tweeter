import { NavigateFunction } from "react-router-dom";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, NavigateView, Presenter } from "./Presenter";

export interface AppNavbarView extends MessageView, NavigateView {
	clearUserInfo: () => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
	private userService: UserService = new UserService();

	public async logOut(authToken: AuthToken | null) {
		const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
		await this.doFailureReportingOperation(
			async () => {
				await this.userService.logout(authToken!);

				this.view.deleteMessage(loggingOutToastId);
				this.view.clearUserInfo();
				this.view.navigate("/login");
			},
			"log user out",
			() => {}
		);
	}
}
