import { AuthToken, Status, FakeData, StatusDTO } from "tweeter-shared";
import { Service } from "./Service";

export class ServerStatusService implements Service {
	public async loadMoreFeedItems(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null,
	): Promise<[StatusDTO[], boolean]> {
		return this.getFakeData(lastItem, pageSize);
	}

	public async loadMoreStoryItems(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null,
	): Promise<[StatusDTO[], boolean]> {
		return this.getFakeData(lastItem, pageSize);
	}

	private async getFakeData(lastItem: StatusDTO | null, pageSize: number): Promise<[StatusDTO[], boolean]> {
		const [items, hasMoreItems] = FakeData.instance.getPageOfStatuses(Status.fromDTO(lastItem), pageSize);
		const dtos = items.map((status) => status.DTO);
		return [dtos, hasMoreItems];
	}

	public async postStatus(token: string, newStatus: Status): Promise<void> {
		await new Promise((f) => setTimeout(f, 2000));
	}
}
