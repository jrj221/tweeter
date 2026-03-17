import {
	PagedStatusItemRequest,
	PagedUserItemRequest,
	PagedItemRequest,
	PagedItemResponse,
	Status,
	User,
	UserDTO,
	StatusDTO,
	GetUserRequest,
	GetUserResponse, // Why import this?
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
	private SERVER_URL = "https://zebl720pcc.execute-api.us-east-1.amazonaws.com/prod"; // From API Gateway prod stage

	private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

	public async getMoreItems<T, V>(
		request: PagedItemRequest<T>,
		endpoint: string,
		itemDescription: string,
		itemType: { fromDTO: (dto: T | null) => V | null },
	): Promise<[V[], boolean]> {
		const response = await this.clientCommunicator.doPost<PagedItemRequest<T>, PagedItemResponse<T>>(
			request,
			endpoint,
		);

		// Convert the T (DTO) array returned by ClientCommunicator to a V array
		const items: V[] | null =
			response.success && response.items ? response.items.map((dto) => itemType.fromDTO(dto) as V) : null;

		// Handle errors
		if (response.success) {
			if (items == null) {
				throw new Error(`No ${itemDescription} found`);
			} else {
				return [items, response.hasMoreItems];
			}
		} else {
			console.error(response);
			throw new Error(response.message ?? undefined);
		}
	}

	public async getMoreFollowees(request: PagedUserItemRequest): Promise<[User[], boolean]> {
		return this.getMoreItems<UserDTO, User>(request, "/followee/list", "followees", User);
	}

	public async getMoreFollowers(request: PagedUserItemRequest): Promise<[User[], boolean]> {
		return this.getMoreItems<UserDTO, User>(request, "/follower/list", "followers", User);
	}

	public async getMoreStoryItems(request: PagedStatusItemRequest): Promise<[Status[], boolean]> {
		return this.getMoreItems<StatusDTO, Status>(request, "/story/list", "story items", Status);
	}

	public async getMoreFeedItems(request: PagedStatusItemRequest): Promise<[Status[], boolean]> {
		return this.getMoreItems<StatusDTO, Status>(request, "/feed/list", "feed items", Status);
	}

	public async getUser(request: GetUserRequest): Promise<User | null> {
		const response = await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(request, "/user/get");

		if (response.success) {
			const user = response.user;
			if (user == null) {
				throw new Error(`User ${request.alias} not found`);
			} else {
				return User.fromDTO(user);
			}
		} else {
			console.error(response);
			throw new Error(response.message ?? undefined);
		}
	}
}
