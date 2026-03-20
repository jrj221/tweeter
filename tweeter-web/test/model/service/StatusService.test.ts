import "isomorphic-fetch";
import { StatusService } from "../../../src/model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

const statusService = new StatusService();

describe("StatusService", () => {
	it("gets a page of story items", async () => {
		const authToken = new AuthToken("pass123", Date.now());
		const alias = "@allen";
		const [stories, hasMoreStories] = await statusService.loadMoreStoryItems(authToken, alias, 10, null);

		expect(stories).toBeTruthy();
		expect(hasMoreStories).toBeTruthy();

		const MALE_IMAGE_URL = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
		const FEMALE_IMAGE_URL = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png";

		const expectedStatuses = [
			new Status(
				`Post 0 0\n        My friend @amy likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?`,
				new User("Allen", "Anderson", "@allen", MALE_IMAGE_URL),
				0,
			),
			new Status(
				`Post 0 1\n        My friend @bob likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?`,
				new User("Amy", "Ames", "@amy", FEMALE_IMAGE_URL),
				30000000000,
			),
			new Status(
				`Post 0 2\n        My friend @bonnie likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?`,
				new User("Bob", "Bobson", "@bob", MALE_IMAGE_URL),
				60000000000,
			),
			new Status(
				`Post 0 3\n        My friend @chris likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?`,
				new User("Bonnie", "Beatty", "@bonnie", FEMALE_IMAGE_URL),
				90000000000,
			),
			new Status(
				`Post 0 4\n        My friend @cindy likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?`,
				new User("Chris", "Colston", "@chris", MALE_IMAGE_URL),
				120000000000,
			),
			new Status(
				`Post 0 5\n        My friend @dan likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?`,
				new User("Cindy", "Coats", "@cindy", FEMALE_IMAGE_URL),
				150000000000,
			),
			new Status(
				`Post 0 6\n        My friend @dee likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?`,
				new User("Dan", "Donaldson", "@dan", MALE_IMAGE_URL),
				180000000000,
			),
			new Status(
				`Post 0 7\n        My friend @elliott likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?`,
				new User("Dee", "Dempsey", "@dee", FEMALE_IMAGE_URL),
				210000000000,
			),
			new Status(
				`Post 0 8\n        My friend @elizabeth likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?`,
				new User("Elliott", "Enderson", "@elliott", MALE_IMAGE_URL),
				240000000000,
			),
			new Status(
				`Post 0 9\n        My friend @frank likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?`,
				new User("Elizabeth", "Engle", "@elizabeth", FEMALE_IMAGE_URL),
				270000000000,
			),
		];

		expect(stories).toEqual(expectedStatuses);
	});
});
