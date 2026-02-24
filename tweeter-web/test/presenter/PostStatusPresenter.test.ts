import { AuthToken, Status, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter";
import { mock, instance, spy, when, verify, anything, capture } from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
	let mockPostStatusPresenterView: PostStatusView;
	let postStatusPresenter: PostStatusPresenter;
	let mockStatusService: StatusService;

	// Fake variables to use for now
	const post: string = "this is my post";
	const currentUser: User | null = new User("Jack", "Johnson", "jj", "myImage.url");
	const authToken: AuthToken | null = new AuthToken("abc123", Date.now());

	beforeEach(() => {
		mockPostStatusPresenterView = mock<PostStatusView>();
		const mockPostStatusPresenterViewInstance = instance(mockPostStatusPresenterView);

		const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusPresenterViewInstance));
		postStatusPresenter = instance(postStatusPresenterSpy);

		mockStatusService = mock<StatusService>();
		when(postStatusPresenterSpy.statusService).thenReturn(instance(mockStatusService));
	});

	it("tells the view to display a posting status message", async () => {
		await postStatusPresenter.submitPost(post, currentUser, authToken);

		// when(mockPostStatusPresenterView.displayInfoMessage("Posting Status...", 0)).thenReturn("messageID123");

		verify(mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)).once();
	});

	it("calls postStatus on the post status service with the correct status string and auth token", async () => {
		await postStatusPresenter.submitPost(post, currentUser, authToken);

		verify(mockStatusService.postStatus(authToken, anything())).once();

		let [, status] = capture(mockStatusService.postStatus).last();
		expect(status.post).toEqual(post);
	});

	it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when posting is successful", async () => {
		when(mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)).thenReturn("postID123");
		await postStatusPresenter.submitPost(post, currentUser, authToken);

		verify(mockPostStatusPresenterView.deleteMessage("postID123")).once(); // Clears previous post
		verify(mockPostStatusPresenterView.setPost("")).once(); // Clears the post
		verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).once(); // Displays "Status posted" message
	});
});
