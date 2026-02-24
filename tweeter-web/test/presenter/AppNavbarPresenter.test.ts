import { AuthToken } from "tweeter-shared";
import { AppNavbarView, AppNavbarPresenter } from "../../src/presenter/AppNavbarPresenter";
import { mock, instance, verify, anything, spy, when, capture } from "@typestrong/ts-mockito";
import { UserService } from "../../src/model.service/UserService";

// When you stub or verify you have to use the mock or spy.
// When you call methods you use instances

describe("AppNavbarPresenter", () => {
	let mockAppNavbarPresenterView: AppNavbarView;
	let appNavbarPresenter: AppNavbarPresenter;
	let mockService: UserService;

	const authToken = new AuthToken("abc123", Date.now()); // Fake authToken for now

	beforeEach(() => {
		mockAppNavbarPresenterView = mock<AppNavbarView>();
		const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);

		const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarPresenterViewInstance)); // A spy so we can stub methods
		appNavbarPresenter = instance(appNavbarPresenterSpy);

		mockService = mock<UserService>();

		when(appNavbarPresenterSpy.userService).thenReturn(instance(mockService));
	});

	it("tells the view to display a logging out message", async () => {
		await appNavbarPresenter.logOut(authToken);
		verify(mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
	});

	it("calls logout on the user service with the correct auth token", async () => {
		await appNavbarPresenter.logOut(authToken); // Using the same arg here basically means that if the test passes, the service used the right authToken (the same one)
		verify(mockService.logout(authToken)).once();

		// Same thing, just a different way of doing it
		// let [capturedAuthToken] = capture(mockService.logout).last();
		// expect(capturedAuthToken).toEqual(authToken);
	});
});
