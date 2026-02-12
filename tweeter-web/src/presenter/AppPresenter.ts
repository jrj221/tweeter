import { AuthToken, User } from "tweeter-shared";

export interface AppView {

}

export class AppPresenter {
    private _view: AppView;

    public constructor(view: AppView) {
        this._view = view;
    }

    public isAuthenticated(currentUser: User | null, authToken: AuthToken | null) {
        return !!currentUser && !!authToken;
      };
}