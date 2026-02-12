import { AuthToken, User } from "tweeter-shared";
import { Status } from "tweeter-shared/dist/model/domain/Status";
import { UserService } from "../model.service/UserService";


export interface StatusItemView {
    addItems: (newItems: Status[]) => void
    displayErrorMessage: (message: string) => void
}

export abstract class StatusItemPresenter {
    private _hasMoreItems: boolean = true;
    private _lastItem: Status | null = null;
    private _view: StatusItemView;
    private userService: UserService;

    public constructor(view: StatusItemView) {
        this._view = view;
        this.userService = new UserService();
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    protected set lastItem(value: Status | null) {
        this._lastItem = value;
    }

    protected get lastItem() {
        return this._lastItem;
    }

    protected get view() {
        return this._view;
    }

    public reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    };

    public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return this.userService.getUser(authToken, alias);
      };

    public abstract loadMoreItems (authToken: AuthToken, userAlias: string): void
}