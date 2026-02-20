import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface AppView extends View {}

export class AppPresenter extends Presenter<AppView> {
	public isAuthenticated(
		currentUser: User | null,
		authToken: AuthToken | null
	) {
		return !!currentUser && !!authToken;
	}
}
