import React from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import PostStatus from "../../src/components/postStatus/PostStatus";
import { useUserInfo } from "../../src/components/userInfo/UserInfoHooks";

// Mocks the userInfoHook which PostStatus needs I guess
jest.mock("../../src/components/userInfo/UserInfoHooks", () => ({
	...jest.requireActual("../../src/components/userInfo/UserInfoHooks"),
	__esModule: true,
	useUserInfo: jest.fn(),
}));

describe("PostStatus Component", () => {
	beforeAll(() => {
		(useUserInfo as jest.Mock).mockReturnValue({
			currentUser: mockUserInstance,
			authToken: mockAuthTokenInstance,
		});
	});

	it("starts with the Post Status and Clear buttons disabled", () => {
		const { postStatusButton, clearButton } = renderPostStatusAndGetElements();

		expect(postStatusButton).toBeDisabled();
		expect(clearButton).toBeDisabled();
	});

	it("enables both Post Status and Clear buttons when the text field has text", () => {
		const { postStatusButton, clearButton, textField, user } = renderPostStatusAndGetElements();

		user.type(textField, "this is my post");
		expect(postStatusButton).toBeEnabled();
		expect(clearButton).toBeEnabled();
	});
});

function renderPostStatus() {
	return render(<PostStatus />);
}

function renderPostStatusAndGetElements() {
	const user = userEvent.setup();

	renderPostStatus();

	const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
	const clearButton = screen.getByRole("button", { name: /Clear/i });
	const textField = screen.getByLabelText("postStatusTextField");
	return { postStatusButton, clearButton, textField, user };
}
