import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/ServerFollowService";

// This function gets called by API Gateway when you make a request
export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
	const followService = new FollowService();
	const [items, hasMore] = await followService.loadMoreFollowees(
		request.token,
		request.userAlias,
		request.pageSize,
		request.lastItem,
	);
	return { success: true, message: null, items: items, hasMoreItems: hasMore };
};
