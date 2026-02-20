import { User } from "tweeter-shared";
import { Item } from "../Item";

interface Props {
	user: User;
	featureUrl: string;
}

const UserItem = (props: Props) => {
	return (
		<Item
			imageUrl={props.user.imageUrl}
			firstName={props.user.firstName}
			lastName={props.user.firstName}
			userAlias={props.user.alias}
			featureUrl={props.featureUrl}
			isPost={false}
		/>
	);
};

export default UserItem;
