export interface View {
	displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
	displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => string;
	deleteMessage: (messageID: string) => void;
}

export abstract class Presenter<V extends View> {
	private _view: V;

	public constructor(view: V) {
		this._view = view;
	}

	protected get view() {
		return this._view;
	}

	protected async doFailureReportingOperation(
		tryOperation: () => Promise<void>,
		operationDescription: string,
		finallyOperation: () => void
	) {
		try {
			await tryOperation();
		} catch (error) {
			this._view.displayErrorMessage(`Failed to ${operationDescription} because of exception: ${error}`);
		} finally {
			finallyOperation();
		}
	}
}
