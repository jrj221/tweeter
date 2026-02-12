
export interface OAuthView {
    displayInfoMessage: (message: string, duratino: number, bootstrapClasses?: string) => string;
}

export class OAuthPresenter {
    private _view: OAuthView;

    public constructor(view: OAuthView) {
        this._view = view;
    }

    public displayInfoMessageWithDarkBackground(message: string): void {
        this._view.displayInfoMessage(
          message,
          3000,
          "text-white bg-primary"
        );
      };
}