import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import "@testing-library/jest-dom";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fab);

describe("Login Component", () => {
	it("starts with the sign-in button disabled", () => {
		const { signInButton } = renderLoginAndGetElements("/");

		expect(signInButton).toBeDisabled();
	});

	it("enables the sign-in button if both alias and password fields have text", async () => {
		const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements("/");

		// Should be disabled with just alias
		await user.type(aliasField, "myAlias");
		expect(signInButton).toBeDisabled();

		// Should be disabled with just password
		await user.clear(aliasField);
		await user.type(passwordField, "myPassword");
		expect(signInButton).toBeDisabled();

		// Should be enabled with both
		await user.type(aliasField, "myAlias");
		expect(signInButton).toBeEnabled();
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
