import { AuthToken } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { StatusService } from "../model.service/StatusService";

export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusItemPresenter {
    private statusService : StatusService;

    public constructor(view: StatusItemView) {
        super(view)
        this.statusService = new StatusService();
    }

    public async loadMoreItems (authToken: AuthToken, userAlias: string) {
        try {
          const [newItems, hasMore] = await this.statusService.loadMoreFeedItems(
            authToken!,
            userAlias,
            PAGE_SIZE,
            this.lastItem
          );
    
          this.hasMoreItems = hasMore;
          console.log(newItems);
          if (newItems.length > 0) {
            this.lastItem = newItems[newItems.length - 1];
          } else {
            this.lastItem = null;
          }
          this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
          console.log(this.lastItem);
          this.view.addItems(newItems);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to load feed items because of exception: ${error}`,
          );
        }
      };
}