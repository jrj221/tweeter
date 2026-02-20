import { MessageView, Presenter } from "./Presenter";

export interface OAuthView extends MessageView {}

export class OAuthPresenter extends Presenter<OAuthView> {
	public displayInfoMessageWithDarkBackground(message: string): void {
		this.view.displayInfoMessage(message, 3000, "text-white bg-primary");
	}
}
