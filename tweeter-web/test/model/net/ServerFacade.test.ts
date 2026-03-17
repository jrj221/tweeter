import { GetCountRequest, PagedUserItemRequest, RegisterRequest, User } from "tweeter-shared";
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

	it("gets a page of followers for a user", async () => {
		const request: PagedUserItemRequest = {
			pageSize: 5,
			lastItem: null,
			alias: "@allen",
			token: "",
		};

		const [followers, hasMoreItems] = await facade.getMoreFollowers(request);

		expect(followers).toBeTruthy();
		expect(hasMoreItems).toBeTruthy(); // To see if there are more items

		const MALE_IMAGE_URL: string = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
		const FEMALE_IMAGE_URL: string = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png";

		// Just the first 5 since that's the pageSize I requested
		// Note: @allen is omitted since you can't follow yourself, so results shift by one
		const expectedFollowers = [
			new User("Amy", "Ames", "@amy", FEMALE_IMAGE_URL),
			new User("Bob", "Bobson", "@bob", MALE_IMAGE_URL),
			new User("Bonnie", "Beatty", "@bonnie", FEMALE_IMAGE_URL),
			new User("Chris", "Colston", "@chris", MALE_IMAGE_URL),
			new User("Cindy", "Coats", "@cindy", FEMALE_IMAGE_URL),
		];

		expect(followers).toEqual(expectedFollowers);
	});

	it("gets the number of followers for a user", async () => {
		const request: GetCountRequest = {
			token: "",
			user: {
				firstName: "Allen",
				lastName: "Anderson",
				alias: "@allen",
				imageURL: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png",
			},
		};

		const count = await facade.getFollowerCount(request);

		expect(count).toBeTruthy();
		expect(count).toBeGreaterThan(0);
	});
});
