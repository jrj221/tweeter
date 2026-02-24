import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter";
import { mock, instance, spy, when, verify } from "@typestrong/ts-mockito";

describe("PostStatusPresenter", () => {
	let mockPostStatusPresenterView: PostStatusView;
	let postStatusPresenter: PostStatusPresenter;

	// Fake variables to use for now
	let post: string = "this is my post";
	let currentUser: User | null = new User("Jack", "Johnson", "jj", "myImage.url");
	let authToken: AuthToken | null = new AuthToken("abc123", Date.now());

	beforeEach(() => {
		mockPostStatusPresenterView = mock<PostStatusView>();
		const mockPostStatusPresenterViewInstance = instance(mockPostStatusPresenterView);

		const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusPresenterViewInstance));
		postStatusPresenter = instance(postStatusPresenterSpy);
	});

	it("tells the view to display a posting status message", async () => {
		await postStatusPresenter.submitPost(post, currentUser, authToken);

		// when(mockPostStatusPresenterView.displayInfoMessage("Posting Status...", 0)).thenReturn("messageID123");

		verify(mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)).once();
	});
});
