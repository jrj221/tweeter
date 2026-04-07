import { Status, StatusDTO, UserDTO } from "tweeter-shared";
import { Service } from "./Service";

export class ServerStatusService extends Service {
	public async loadMoreFeedItems(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null,
	): Promise<[StatusDTO[], boolean]> {
		return await this.getMoreItems(
			token,
			userAlias,
			pageSize,
			lastItem,
			(alias, limit, last) => this._daoFactory.makeFeedDAO().getPageOfFeedItems(alias, limit, last),
			(items) =>
				this.populateUsers(
					items,
					(item) => item.user.alias,
					(item, user) => Object.assign(item, { user }),
				),
		);
	}

	public async loadMoreStoryItems(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null,
	): Promise<[StatusDTO[], boolean]> {
		return await this.getMoreItems(
			token,
			userAlias,
			pageSize,
			lastItem,
			(alias, limit, last) => this._daoFactory.makeStatusDAO().getPageOfStatuses(alias, limit, last),
			(items) =>
				this.populateUsers(
					items,
					(item) => item.user.alias,
					(item, user) => Object.assign(item, { user }),
				),
		);
	}

	public async addStory(token: string, newStatus: Status): Promise<void> {
		this.checkParams(token, newStatus);
		await this.doAuthenticate(token);

		const statusDTO = newStatus.DTO;
		const statusDAO = this._daoFactory.makeStatusDAO();
		await statusDAO.addStatus(statusDTO);
	}

	public async addFeedItem(token: string, newStatus: StatusDTO, followerAlias: string): Promise<void> {
		this.checkParams(token, newStatus);
		await this.doAuthenticate(token);

		const feedDAO = this._daoFactory.makeFeedDAO();
		await feedDAO.addFeedItem(followerAlias, newStatus);
	}

	public async batchAddFeedItems(token: string, newStatus: StatusDTO, followerAliases: string[]): Promise<void> {
		this.checkParams(token, newStatus);
		await this.doAuthenticate(token);

		const feedDAO = this._daoFactory.makeFeedDAO();
		await feedDAO.batchAddFeedItems(followerAliases, newStatus);
	}
}
