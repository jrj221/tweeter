import { RegisterRequest, User } from "tweeter-shared";
import "isomorphic-fetch";
import { ServerFacade } from "../../../src/model/net/ServerFacade";

const facade = new ServerFacade();

describe("ServerFacade", () => {
	it("registers a user", async () => {
		const request: RegisterRequest = {
			firstName: "Allen",
			lastName: "Anderson",
			alias: "@allen",
			password: "pass123",
			userImageBytes: "",
			imageFileExtension: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png",
		};
		const [user, authToken] = await facade.register(request);

		expect(user).toBeTruthy();
		expect(authToken).toBeTruthy();

		const expectedUser = new User(
			"Allen",
			"Anderson",
			"@allen",
			"https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png",
		);
		expect(user).toEqual(expectedUser);
	});

	it("gets a page of followers for a user", async () => {});

	it("gets the number of followers for a user", async () => {});
});
