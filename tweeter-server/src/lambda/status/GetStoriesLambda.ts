import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

// This function gets called by API Gateway when you make a request
export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
    const statusService = new StatusService();
    const [items, hasMore] = await statusService.loadMoreStoryItems(request.token, request.userAlias, request.pageSize, request.lastItem);
    return {success: true, message: null, items: items, hasMoreItems: hasMore};
} 