import { AuthToken, User } from "tweeter-shared";
import { Status } from "tweeter-shared/dist/model/domain/Status";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
	setIsLoading: (value: boolean) => void;
	setPost: (value: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
	private statusService: StatusService = new StatusService();

	public async submitPost(post: string, currentUser: User | null, authToken: AuthToken | null) {
		var postingStatusMessageId = "";

		try {
			this.view.setIsLoading(true);
			postingStatusMessageId = this.view.displayInfoMessage("Posting status...", 0);

			const status = new Status(post, currentUser!, Date.now());

			await this.statusService.postStatus(authToken!, status);

			this.view.setPost("");
			this.view.displayInfoMessage("Status posted!", 2000);
		} catch (error) {
			this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
		} finally {
			this.view.deleteMessage(postingStatusMessageId);
			this.view.setIsLoading(false);
		}
	}

	public checkButtonStatus(post: string, currentUser: User | null, authToken: AuthToken | null) {
		return !post.trim() || !authToken || !currentUser;
	}
}
