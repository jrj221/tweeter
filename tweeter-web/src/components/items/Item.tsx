import { Link } from "react-router-dom";
import { Status } from "tweeter-shared";
import { useUserNavigation } from "../userNavigationHook/UserNavigationHook";
import Post from "./statusItem/Post";

type Props = {
	imageUrl: string;
	firstName: string;
	lastName: string;
	userAlias: string;
	featureUrl: string;
} & ({ isPost: true; formattedDate: string; status: Status } | { isPost: false });

export const Item = (props: Props) => {
	const navigateToUser = useUserNavigation();

	return (
		<div className="col bg-light mx-0 px-0">
			<div className="container px-0">
				<div className="row mx-0 px-0">
					<div className="col-auto p-3">
						<img src={props.imageUrl} className="img-fluid" width="80" alt="Posting user" />
					</div>
					<div className="col">
						<h2>
							<b>
								{props.firstName} {props.lastName}
							</b>{" "}
							-{" "}
							<Link to={`${props.featureUrl}/${props.userAlias}`} onClick={navigateToUser}>
								{props.userAlias}
							</Link>
						</h2>
						{props.isPost && (
							<>
								{props.formattedDate}
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
