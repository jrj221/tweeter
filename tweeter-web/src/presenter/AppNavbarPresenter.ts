import { NavigateFunction } from "react-router-dom";
import { AuthToken } from "tweeter-shared";

export interface AppNavbarView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (messageID: string) => void;
    navigate: NavigateFunction;
    clearUserInfo: () => void;
}

export class AppNavbarPresenter {
    private _view: AppNavbarView;

    public constructor(view: AppNavbarView) {
        this._view = view;
    }

    private async logout(authToken: AuthToken): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
      };

    public async logOut(authToken: AuthToken | null) {
        const loggingOutToastId = this._view.displayInfoMessage("Logging Out...", 0);
    
        try {
          await this.logout(authToken!);
    
          this._view.deleteMessage(loggingOutToastId);
          this._view.clearUserInfo();
          this._view.navigate("/login");
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to log user out because of exception: ${error}`
          );
        }
      };
}