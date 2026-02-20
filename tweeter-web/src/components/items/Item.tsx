import { Link } from "react-router-dom";
import { Status, User } from "tweeter-shared";
import { useUserNavigation } from "../userNavigationHook/UserNavigationHook";
import Post from "./statusItem/Post";

type Props = {
	user: User;
	featureUrl: string;
} & ({ isPost: true; status: Status } | { isPost: false });

export const Item = (props: Props) => {
	const navigateToUser = useUserNavigation();

	return (
		<div className="col bg-light mx-0 px-0">
			<div className="container px-0">
				<div className="row mx-0 px-0">
					<div className="col-auto p-3">
						<img src={props.user.imageUrl} className="img-fluid" width="80" alt="Posting user" />
					</div>
					<div className="col">
						<h2>
							<b>
								{props.user.firstName} {props.user.lastName}
							</b>{" "}
							-{" "}
							<Link to={`${props.featureUrl}/${props.user.alias}`} onClick={navigateToUser}>
								{props.user.alias}
							</Link>
						</h2>
						{props.isPost && (
							<>
								{props.status.formattedDate}
								<br />
								<Post status={props.status!} featurePath={props.featureUrl} />
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
