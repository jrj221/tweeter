import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { UserService } from "../model.service/UserService";
import { User } from "tweeter-shared";
import { DisplayUserView, Presenter } from "./Presenter";

export interface UserNavigationView extends DisplayUserView {}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
	private userService: UserService = new UserService();

	private extractAlias(value: string) {
		const index = value.indexOf("@");
		return value.substring(index);
	}

	public async navigateToUser(eventString: string, authToken: AuthToken | null, displayedUser: User | null) {
		await this.doFailureReportingOperation(
			async () => {
				const alias = this.extractAlias(eventString);

				const toUser = await this.userService.getUser(authToken!, alias);

				if (toUser) {
					if (!toUser.equals(displayedUser!)) {
						this.view.setDisplayedUser(toUser);
						const regex = /\/([^\/]+)\/@/; // should match with "feed" in http://localhost5173/feed/@amy
						const featureUrl = "/" + eventString.match(regex)![1];

						//   console.log("event: " + event.target.toString());
						//   console.log("captured: " + featureUrl);

						this.view.navigate(`${featureUrl}/${toUser.alias}`);
					}
				}
			},
			"get user",
			() => {}
		);
	}
}
