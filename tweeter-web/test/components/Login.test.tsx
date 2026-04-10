import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { UserEvent, userEvent } from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import "@testing-library/jest-dom";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../src/presenter/LoginPresenter";
library.add(fab);
import { mock, instance, verify } from "@typestrong/ts-mockito";

// describe("Login Component", () => {
// 	it("starts with the sign-in button disabled", () => {
// 		const { signInButton } = renderLoginAndGetElements("/");

// 		expect(signInButton).toBeDisabled();
// 	});

// 	it("enables the sign-in button if both alias and password fields have text", async () => {
// 		const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements("/");

// 		await expectEnabledWithBoth(user, aliasField, passwordField, signInButton);
// 	});

// 	it("disables the sign-in button if either the alias or the password is cleared", async () => {
// 		const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements("/");

// 		// Should be enabled with both
// 		await expectEnabledWithBoth(user, aliasField, passwordField, signInButton);

// 		// Should not be enabled with just password
// 		await act(async () => {
// 			await user.clear(aliasField);
// 		});
// 		expect(signInButton).toBeDisabled();

// 		// Putting the alias back should enable it again
// 		await act(async () => {
// 			await user.type(aliasField, "myAlias");
// 		});
// 		expect(signInButton).toBeEnabled();

// 		// Should not be enabled with just alias
// 		await act(async () => {
// 			await user.clear(passwordField);
// 		});
// 		expect(signInButton).toBeDisabled();
// 	});

// 	it("calls the presenter's login method with the correct parameters when the sign-in button is pressed", async () => {
// 		const mockPresenter = mock(LoginPresenter);
// 		const mockPresenterInstance = instance(mockPresenter);

// 		const originalurl = "htpps://somewhere.com";
// 		const alias = "myAlias";
// 		const password = "myPassword";

// 		const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements(
// 			originalurl,
// 			mockPresenterInstance
// 		);

// 		await typeAliasAndPassword(user, aliasField, passwordField);
// 		await act(async () => {
// 			await user.click(signInButton);
// 		});

// 		verify(mockPresenter.doLogin(alias, password, originalurl, false)).once();
// 	});
// });

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
	return render(
		<MemoryRouter>
			{!!presenter ? (
				<Login originalUrl={originalUrl} presenter={presenter} />
			) : (
				<Login originalUrl={originalUrl} />
			)}
		</MemoryRouter>,
	);
}

function renderLoginAndGetElements(originalUrl: string, presenter?: LoginPresenter) {
	const user = userEvent.setup();

	renderLogin(originalUrl, presenter);

	const signInButton = screen.getByRole("button", { name: /Sign in/i }); // "i" means case insensitive
	const aliasField = screen.getByLabelText("alias");
	const passwordField = screen.getByLabelText("password");

	return { user, signInButton, aliasField, passwordField };
}

async function typeAliasAndPassword(
	user: UserEvent,
	aliasField: HTMLElement,
	passwordField: HTMLElement,
	alias: string = "myAlias",
	password: string = "myPassword",
) {
	await act(async () => {
		await user.type(aliasField, alias);
	});
	await act(async () => {
		await user.type(passwordField, password);
	});
}

async function expectEnabledWithBoth(
	user: UserEvent,
	aliasField: HTMLElement,
	passwordField: HTMLElement,
	signInButton: HTMLElement,
) {
	await typeAliasAndPassword(user, aliasField, passwordField);
	expect(signInButton).toBeEnabled();
}
