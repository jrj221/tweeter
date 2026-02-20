import { Toast } from "../components/toaster/Toast";
import { MessageView, Presenter } from "./Presenter";

export interface ToasterView extends MessageView {}

export class ToasterPresenter extends Presenter<ToasterView> {
	public deleteExpiredToasts(messageList: Toast[]) {
		const now = Date.now();

		for (let toast of messageList) {
			if (
				toast.expirationMillisecond > 0 &&
				toast.expirationMillisecond < now
			) {
				this.view.deleteMessage(toast.id);
			}
		}
	}
}
