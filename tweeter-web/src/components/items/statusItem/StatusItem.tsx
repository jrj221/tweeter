import { Status } from "tweeter-shared";
import { Item } from "../Item";

interface Props {
	status: Status;
	featureUrl: string;
}

const StatusItem = (props: Props) => {
	return (
		<Item
			imageUrl={props.status.user.imageUrl}
			firstName={props.status.user.firstName}
			lastName={props.status.user.lastName}
			userAlias={props.status.user.alias}
			featureUrl={props.featureUrl}
			isPost={true}
			formattedDate={props.status.formattedDate}
			status={props.status}
		/>
	);
};

export default StatusItem;
