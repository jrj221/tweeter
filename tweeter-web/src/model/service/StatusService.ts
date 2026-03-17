import { AuthToken, Status, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";
export class StatusService implements Service {
	public async loadMoreFeedItems(
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: Status | null,
	): Promise<[Status[], boolean]> {
		// TODO: Replace with the result of calling server
		const facade = new ServerFacade();
		return await facade.getMoreFeedItems({
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
		const facade = new ServerFacade();
		return await facade.getMoreStoryItems({
			token: authToken.token,
			alias: userAlias,
			pageSize: pageSize,
			lastItem: lastItem?.DTO ?? null,
		});
	}

	public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
		const facade = new ServerFacade();
		await facade.postStatus({
			token: authToken.token,
			newStatus: newStatus.DTO,
		});
	}
}
