import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter";
import { UserService } from "../../src/model/service/UserService";
import { StatusService } from "../../src/model/service/StatusService";
import { mock, instance, verify } from "@typestrong/ts-mockito";
import "isomorphic-fetch";

describe("Integration Test", () => {
	let userService: UserService;
	let statusService: StatusService;
	let mockPostStatusView: PostStatusView;
	let postStatusPresenter: PostStatusPresenter;

	beforeAll(() => {
		userService = new UserService();
		statusService = new StatusService();
	});

	it("Logs a user in, posts a status, and the user can see it in their story", async () => {
		// 1. Log a user in. [This can be done by directly accessing the ServerFacade or client side service class]
		const [user, authToken] = await userService.login("@jack", "pass");
		expect(user).toBeDefined();
		expect(authToken).toBeDefined();

		// 2. Post a status from the user to the server by calling the "post status" operation on the relevant Presenter.
		mockPostStatusView = mock<PostStatusView>();
		const mockPostStatusViewInstance = instance(mockPostStatusView);
		postStatusPresenter = new PostStatusPresenter(mockPostStatusViewInstance);

		const postContent = "Integration test post: " + Date.now();
		await postStatusPresenter.submitPost(postContent, user, authToken);

		// 3. Verify that the "Status posted!" message was displayed to the user.
		verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();

		// 4. Retrieve the user's story from the server to verify that the new status was correctly appended to the user's story,
		// and that all status details are correct. [This can be done by directly accessing the ServerFacade or client side
		// service class]
		const [storyItems, hasMore] = await statusService.loadMoreStoryItems(authToken, user.alias, 10, null);

		const foundStatus = storyItems.find((status) => status.post === postContent);
		expect(foundStatus).toBeDefined();
		expect(foundStatus?.user.alias).toBe(user.alias);
		expect(foundStatus?.post).toBe(postContent);
	});
});
