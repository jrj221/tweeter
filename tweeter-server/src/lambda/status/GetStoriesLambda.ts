import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { ServerStatusService } from "../../model/service/ServerStatusService";
import { DynamoDBDAOFactory } from "../../dao/DynamoDBDAO/DynamoDBFactory";

// This function gets called by API Gateway when you make a request
export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
	try {
		const statusService = new ServerStatusService(new DynamoDBDAOFactory());
		const [items, hasMore] = await statusService.loadMoreStoryItems(
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
