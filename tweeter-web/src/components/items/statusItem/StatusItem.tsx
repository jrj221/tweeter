import { Status } from "tweeter-shared";
import { Item } from "../Item";

interface Props {
	status: Status;
	featureUrl: string;
}

const StatusItem = (props: Props) => {
	return <Item user={props.status.user} featureUrl={props.featureUrl} isPost={true} status={props.status} />;
};

export default StatusItem;
