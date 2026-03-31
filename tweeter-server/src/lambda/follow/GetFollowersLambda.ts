import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { ServerFollowService } from "../../model/service/ServerFollowService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";

// This function gets called by API Gateway when you make a request
export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
	try {
		const followService = new ServerFollowService(new DynamoDBDAOFactory());
		const [items, hasMore] = await followService.loadMoreFollowers(
			request.token,
			request.alias,
			request.pageSize,
			request.lastItem,
		);
		return { success: true, message: null, items: items, hasMoreItems: hasMore };
	} catch (error) {
		return { success: false, message: (error as Error).message, items: null, hasMoreItems: false };
	}
};
