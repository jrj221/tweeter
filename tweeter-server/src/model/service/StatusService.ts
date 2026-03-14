import { AuthToken, Status, FakeData, StatusDTO } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService implements Service {
	public async loadMoreFeedItems(
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null
	): Promise<[StatusDTO[], boolean]> {
		// TODO: Replace with the result of calling server
		return this.getFakeData(lastItem, pageSize);
	}

	public async loadMoreStoryItems(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null
	): Promise<[StatusDTO[], boolean]> {
		// TODO: Replace with the result of calling server
		return this.getFakeData(lastItem, pageSize);
	}

    private async getFakeData(lastItem: StatusDTO | null, pageSize: number): Promise<[StatusDTO[], boolean]> {
            const [items, hasMoreItems] = FakeData.instance.getPageOfStatuses(Status.fromDTO(lastItem), pageSize);
            const dtos = items.map((status) => status.DTO);
            return [dtos, hasMoreItems];
        }

	public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
		// Pause so we can see the logging out message. Remove when connected to the server
		await new Promise((f) => setTimeout(f, 2000));

		// TODO: Call the server to post the status
	}
}
