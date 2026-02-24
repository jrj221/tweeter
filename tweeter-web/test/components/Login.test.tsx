import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import "@testing-library/jest-dom";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { sign } from "crypto";
library.add(fab);

describe("Login Component", () => {
	it("starts with the sign-in button disabled", () => {
		const { signInButton } = renderLoginAndGetElements("/");

		expect(signInButton).toBeDisabled();
	});

	it("enables the sign-in button if both alias and password fields have text", async () => {
		const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements("/");

		await user.type(aliasField, "myAlias"); // How do you deduplicate test code?
		await user.type(passwordField, "myPassword");
		expect(signInButton).toBeEnabled();
	});

	it("disables the sign-in button if either the alias or the password is cleared", async () => {
		const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements("/");

		// Should be enabled with both
		await user.type(aliasField, "myAlias");
		await user.type(passwordField, "myPassword");
		expect(signInButton).toBeEnabled();

		// Should not be enabled with just password
		await user.clear(aliasField);
		expect(signInButton).toBeDisabled();

		// Putting the alias back should enable it again
		await user.type(aliasField, "myAlias");
		expect(signInButton).toBeEnabled();

		// Should not be enabled with just alias
		await user.clear(passwordField);
		expect(signInButton).toBeDisabled();
	});
});

function renderLogin(originalUrl: string) {
	return render(
		<MemoryRouter>
			<Login originalUrl={originalUrl} />
		</MemoryRouter>
	);
}

function renderLoginAndGetElements(originalUrl: string) {
	const user = userEvent.setup();

	renderLogin(originalUrl);

	const signInButton = screen.getByRole("button", { name: /Sign in/i }); // "i" means case insensitive
	const aliasField = screen.getByLabelText("alias");
	const passwordField = screen.getByLabelText("password");

	return { user, signInButton, aliasField, passwordField };
}
