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
		return facade.getMoreFeedItems({
			token: authToken.token,
			userAlias: userAlias,
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
		return facade.getMoreStoryItems({
			token: authToken.token,
			userAlias: userAlias,
			pageSize: pageSize,
			lastItem: lastItem?.DTO ?? null,
		});
	}

	public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
		// Pause so we can see the logging out message. Remove when connected to the server
		await new Promise((f) => setTimeout(f, 2000));

		// TODO: Call the server to post the status
	}
}
