import React from "react";
import { render, screen } from "@testing-library/react";
import { UserEvent, userEvent } from "@testing-library/user-event";
import PostStatus from "../../src/components/postStatus/PostStatus";
import { useUserInfo } from "../../src/components/userInfo/UserInfoHooks";
import { PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import { mock, instance, verify, capture } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { act } from "react";
import "@testing-library/jest-dom";

// Mocks the useUserInfo hook which PostStatus needs I guess
jest.mock("../../src/components/userInfo/UserInfoHooks", () => ({
	...jest.requireActual("../../src/components/userInfo/UserInfoHooks"),
	__esModule: true,
	useUserInfo: jest.fn(),
}));

// describe("PostStatus Component", () => {
// 	const mockUserInstance = new User("firstName", "lastName", "alias", "imageUrl");
// 	const mockAuthTokenInstance = new AuthToken("token", Date.now());

// 	beforeAll(() => {
// 		(useUserInfo as jest.Mock).mockReturnValue({
// 			currentUser: mockUserInstance,
// 			authToken: mockAuthTokenInstance,
// 		});
// 	});

// 	it("starts with the Post Status and Clear buttons disabled", () => {
// 		const { postStatusButton, clearButton } = renderPostStatusAndGetElements();

// 		expectButtonsDisabled(postStatusButton, clearButton);
// 	});

// 	it("enables both Post Status and Clear buttons when the text field has text", async () => {
// 		const { postStatusButton, clearButton, textField, user } = renderPostStatusAndGetElements();

// 		await act(async () => {
// 			await user.type(textField, "this is my post");
// 		});
// 		expectButtonsEnabled(postStatusButton, clearButton);

// 		await expectButtonsEnabledWithText(user, textField, postStatusButton, clearButton);
// 	});

// 	it("disables both Post Status and Clear buttons when the text field is cleared", async () => {
// 		const { postStatusButton, clearButton, textField, user } = renderPostStatusAndGetElements();

// 		await expectButtonsEnabledWithText(user, textField, postStatusButton, clearButton);

// 		await act(async () => {
// 			await user.clear(textField);
// 		});
// 		expectButtonsDisabled(postStatusButton, clearButton);
// 	});

// 	it("calls the presenter's postStatus method (mine is called submitPost) with correct parameters when the PostStatus button is pressed", async () => {
// 		const mockPresenter = mock(PostStatusPresenter);
// 		const mockPresenterInstance = instance(mockPresenter);

// 		const { user, textField, postStatusButton } = renderPostStatusAndGetElements(mockPresenterInstance);
// 		const post = "this is my post";

// 		await act(async () => {
// 			await user.type(textField, post);
// 		});
// 		await act(async () => {
// 			await user.click(postStatusButton);
// 		});

// 		verify(mockPresenter.submitPost(post, mockUserInstance, mockAuthTokenInstance)).once();
// 	});
// });

function renderPostStatus(presenter?: PostStatusPresenter) {
	return render(<>{!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}</>);
}

function renderPostStatusAndGetElements(presenter?: PostStatusPresenter) {
	const user = userEvent.setup();

	renderPostStatus(presenter);

	const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
	const clearButton = screen.getByRole("button", { name: /Clear/i });
	const textField = screen.getByLabelText("postStatusTextField");
	return { postStatusButton, clearButton, textField, user };
}

function expectButtonsEnabled(postStatusButton: HTMLElement, clearButton: HTMLElement) {
	expect(postStatusButton).toBeEnabled();
	expect(clearButton).toBeEnabled();
}

function expectButtonsDisabled(postStatusButton: HTMLElement, clearButton: HTMLElement) {
	expect(postStatusButton).toBeDisabled();
	expect(clearButton).toBeDisabled();
}

async function expectButtonsEnabledWithText(
	user: UserEvent,
	textField: HTMLElement,
	postStatusButton: HTMLElement,
	clearButton: HTMLElement,
) {
	await act(async () => {
		await user.type(textField, "this is my post");
	});
	expectButtonsEnabled(postStatusButton, clearButton);
}
