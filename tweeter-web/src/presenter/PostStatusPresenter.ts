import { AuthToken, User } from "tweeter-shared";
import { Status } from "tweeter-shared/dist/model/domain/Status";

export interface PostStatusView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageID: string) => void;
  setIsLoading: (value: boolean) => void;
  setPost: (value: string) => void;
}

export class PostStatusPresenter {
  private _view: PostStatusView;

  public constructor(view: PostStatusView) {
    this._view = view;
  }

  public async submitPost(post: string, currentUser: User | null, authToken: AuthToken | null) {
    var postingStatusMessageId = "";

    try {
      this._view.setIsLoading(true);
      postingStatusMessageId = this._view.displayInfoMessage(
        "Posting status...",
        0
      );

      const status = new Status(post, currentUser!, Date.now());

      await this.postStatus(authToken!, status);

      this._view.setPost("");
      this._view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this._view.deleteMessage(postingStatusMessageId);
      this._view.setIsLoading(false);
    }
  }

  private async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }

  public checkButtonStatus(post: string, currentUser: User | null, authToken: AuthToken | null) {
    return !post.trim() || !authToken || !currentUser;
  };
}
