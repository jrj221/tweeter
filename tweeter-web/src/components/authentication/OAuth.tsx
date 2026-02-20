import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useMessageActions } from "../toaster/MessageHooks";
import { OAuthPresenter, OAuthView } from "../../presenter/OAuthPresenter";
import { useRef } from "react";
import { IconName } from "@fortawesome/fontawesome-svg-core";

const OAuth = () => {
	const { displayInfoMessage, displayErrorMessage, deleteMessage } = useMessageActions();

	const listener: OAuthView = {
		displayInfoMessage: displayInfoMessage,
		displayErrorMessage: displayErrorMessage,
		deleteMessage: deleteMessage,
	};

	const presenterRef = useRef<OAuthPresenter | null>(null);
	if (!presenterRef.current) {
		presenterRef.current = new OAuthPresenter(listener);
	}

	const OAuthOption = (companyName: string) => {
		return (
			<button
				type="button"
				className="btn btn-link btn-floating mx-1"
				onClick={() =>
					presenterRef.current!.displayInfoMessageWithDarkBackground(
						`${companyName} registration is not implemented.`
					)
				}
			>
				<OverlayTrigger
					placement="top"
					overlay={<Tooltip id={`${companyName.toLowerCase()}Tooltip`}>{companyName}</Tooltip>}
				>
					<FontAwesomeIcon icon={["fab", companyName.toLowerCase() as IconName]} />
				</OverlayTrigger>
			</button>
		);
	};

	return (
		<div className="text-center mb-3">
			{OAuthOption("Google")}
			{OAuthOption("Facebook")}
			{OAuthOption("Twitter")}
			{OAuthOption("LinkedIn")}
			{OAuthOption("GitHub")}
		</div>
	);
};

export default OAuth;
