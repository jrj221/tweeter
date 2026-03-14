import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
import { AuthenticationView } from "./Presenter";
import { AuthenticationPresenter } from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
	private _imageUrl: string = "";
	private _imageBytes: Uint8Array = new Uint8Array();
	private _imageFileExtension: string = "";
	private _userService: UserService = new UserService();

	public get imageUrl() {
		return this._imageUrl;
	}

	public checkSubmitButtonStatus(firstName: string, lastName: string, password: string, alias: string): boolean {
		return !firstName || !lastName || !alias || !password || !this._imageUrl || !this._imageFileExtension;
	}

	public handleImageFile(file: File | undefined) {
		if (file) {
			this._imageUrl = URL.createObjectURL(file);

			const reader = new FileReader();
			reader.onload = (event: ProgressEvent<FileReader>) => {
				const imageStringBase64 = event.target?.result as string;

				// Remove unnecessary file metadata from the start of the string.
				const imageStringBase64BufferContents = imageStringBase64.split("base64,")[1];

				const bytes: Uint8Array = Buffer.from(imageStringBase64BufferContents, "base64");

				this._imageBytes = bytes;
			};
			reader.readAsDataURL(file);

			// Set image file extension (and move to a separate method)
			const fileExtension = this.getFileExtension(file);
			if (fileExtension) {
				this._imageFileExtension = fileExtension;
			}
		} else {
			this._imageUrl = "";
			this._imageBytes = new Uint8Array();
		}
	}

	private getFileExtension(file: File): string | undefined {
		return file.name.split(".").pop();
	}

	public async doRegister(firstName: string, lastName: string, password: string, alias: string, rememberMe: boolean) {
		await this.doAuthenticate(
			rememberMe,
			() => {
				return this._userService.register(
					firstName,
					lastName,
					alias,
					password,
					this._imageBytes,
					this._imageFileExtension
				);
			},
			(user) => {
				this.view.navigate(`/feed/${user.alias}`);
			},
			"register user"
		);
	}
}
