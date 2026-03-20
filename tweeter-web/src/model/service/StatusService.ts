import { AuthToken, Status } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";
export class StatusService implements Service {
	private facade = new ServerFacade();

	public async loadMoreFeedItems(
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: Status | null,
	): Promise<[Status[], boolean]> {
		return await this.facade.getMoreFeedItems({
			token: authToken.token,
			alias: userAlias,
			pageSize: pageSize,
			lastItem: lastItem?.DTO ?? null,
		});
	}

	public async loadMoreStoryItems(
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: Status | null,
	): Promise<[Status[], boolean]> {
		return await this.facade.getMoreStoryItems({
			token: authToken.token,
			alias: userAlias,
			pageSize: pageSize,
			lastItem: lastItem?.DTO ?? null,
		});
	}

	public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
		await this.facade.postStatus({
			token: authToken.token,
			newStatus: newStatus.DTO,
		});
	}
}
