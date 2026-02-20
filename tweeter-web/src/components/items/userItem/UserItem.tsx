import { User } from "tweeter-shared";
import { Item } from "../Item";

interface Props {
	user: User;
	featureUrl: string;
}

const UserItem = (props: Props) => {
	return <Item user={props.user} featureUrl={props.featureUrl} isPost={false} />;
};

export default UserItem;
