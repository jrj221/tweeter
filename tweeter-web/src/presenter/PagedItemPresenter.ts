import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model.service/UserService";
import { User } from "tweeter-shared";
import { Service } from "../model.service/Service";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
	addItems: (items: T[]) => void;
}

export abstract class PagedItemPresenter<T, U extends Service> extends Presenter<PagedItemView<T>> {
	private _hasMoreItems: boolean = true;
	private _lastItem: T | null = null;
	private _service: U;
	private userService: UserService = new UserService();

	public constructor(view: PagedItemView<T>) {
		super(view);
		this._service = this.serviceFactory();
	}

	protected abstract serviceFactory(): U;

	public get hasMoreItems() {
		return this._hasMoreItems;
	}

	protected set hasMoreItems(value: boolean) {
		this._hasMoreItems = value;
	}

	protected get lastItem() {
		return this._lastItem;
	}

	protected get service() {
		return this._service;
	}

	protected set lastItem(value: T | null) {
		this._lastItem = value;
	}

	public reset() {
		this._lastItem = null;
		this._hasMoreItems = true;
	}

	public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
		return await this.userService.getUser(authToken, alias);
	}

	public async loadMoreItems(authToken: AuthToken, userAlias: string) {
		await this.doFailureReportingOperation(
			async () => {
				const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

				this.hasMoreItems = hasMore;
				this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
				this.view.addItems(newItems);
			},
			this.itemDescription(),
			() => {}
		);
	}

	protected abstract itemDescription(): string;

	protected abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>;
}
