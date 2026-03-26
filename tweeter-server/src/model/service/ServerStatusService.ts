import { Status, FakeData, StatusDTO, UserDTO } from "tweeter-shared";
import { Service } from "./Service";

export class ServerStatusService extends Service {
	public async loadMoreFeedItems(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null,
	): Promise<[StatusDTO[], boolean]> {
		this.checkParams(token, userAlias, pageSize);
		await this.doAuthenticate(token);
		const feedDAO = this._daoFactory.makeFeedDAO();
		const [dtos, hasMore] = await feedDAO.getPageOfFeedItems(userAlias, pageSize, lastItem);
		await this.populateUserDTOs(dtos);
		return [dtos, hasMore];
	}

	public async loadMoreStoryItems(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null,
	): Promise<[StatusDTO[], boolean]> {
		this.checkParams(token, userAlias, pageSize);
		await this.doAuthenticate(token);
		const statusDAO = this._daoFactory.makeStatusDAO();
		const [dtos, hasMore] = await statusDAO.getPageOfStatuses(userAlias, pageSize, lastItem);
		await this.populateUserDTOs(dtos);
		return [dtos, hasMore];
	}

	private async populateUserDTOs(dtos: StatusDTO[]) {
		const userDAO = this._daoFactory.makeUserDAO();
		for (const dto of dtos) {
			const user = await userDAO.findUserByAlias(dto.user.alias);
			if (user) {
				(dto as any).user = user;
			}
		}
	}

	public async postStatus(token: string, newStatus: Status): Promise<void> {
		this.checkParams(token, newStatus);
		await this.doAuthenticate(token);
		
		const statusDTO = newStatus.DTO;
		const statusDAO = this._daoFactory.makeStatusDAO();
		await statusDAO.addStatus(statusDTO);

		const followDAO = this._daoFactory.makeFollowDAO();
		const feedDAO = this._daoFactory.makeFeedDAO();

		let lastFollower: UserDTO | null = null;
		let hasMoreFollowers = true;

		while (hasMoreFollowers) {
			const [followers, more] = await followDAO.getPageOfFollowers(statusDTO.user.alias, 100, lastFollower);
			for (const follower of followers) {
				await feedDAO.addFeedItem(follower.alias, statusDTO);
			}
			hasMoreFollowers = more;
			if (followers.length > 0) {
				lastFollower = followers[followers.length - 1];
			}
		}
	}
}
