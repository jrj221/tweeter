import { AuthToken } from "tweeter-shared";
import { AppNavbarView, AppNavbarPresenter } from "../../src/presenter/AppNavbarPresenter";
import { mock, instance, verify, anything } from "@typestrong/ts-mockito";

describe("AppNavbarPresenter", () => {
	let mockAppNavbarPresenterView: AppNavbarView;
	let appNavbarPresenter: AppNavbarPresenter;

	const authToken = new AuthToken("abc123", Date.now()); // Fake authToken for now

	beforeEach(() => {
		mockAppNavbarPresenterView = mock<AppNavbarView>();
		const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);

		appNavbarPresenter = new AppNavbarPresenter(mockAppNavbarPresenterViewInstance);
	});

	it("tells the view to display a logging out message", async () => {
		await appNavbarPresenter.logOut(authToken);
		verify(mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
	});
});
