import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { RegisterPresenter, RegisterView } from "../../../presenter/RegisterPresenter";

const Register = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [alias, setAlias] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);

	const navigate = useNavigate();
	const { updateUserInfo } = useUserInfoActions();
	const { displayErrorMessage } = useMessageActions();

	const listener: RegisterView = {
		displayErrorMessage: displayErrorMessage,
		updateUserInfo: updateUserInfo,
		navigate: navigate,
	};

	const presenterRef = useRef<RegisterPresenter | null>(null);
	if (!presenterRef.current) {
		presenterRef.current = new RegisterPresenter(listener);
	}

	const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
		if (
			event.key == "Enter" &&
			!presenterRef.current!.checkSubmitButtonStatus(firstName, lastName, password, alias)
		) {
			presenterRef.current!.doRegister(firstName, lastName, password, alias, rememberMe);
		}
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		presenterRef.current!.handleImageFile(file);
	};

	const nameInputFieldFactory = (id: string, placeholder: string, onChangeOperation: (value: string) => void) => {
		return (
			<div className="form-floating">
				<input
					type="text"
					className="form-control"
					size={50}
					id={id}
					placeholder={placeholder}
					onKeyDown={registerOnEnter}
					onChange={(event) => onChangeOperation(event.target.value)}
				/>
				<label htmlFor={id}>{placeholder}</label>
			</div>
		);
	};

	const inputFieldFactory = () => {
		return (
			<>
				{nameInputFieldFactory("firstNameInput", "First Name", setFirstName)}
				{nameInputFieldFactory("lasttNameInput", "Last Name", setLastName)}
				<AuthenticationFields
					loginOrRegisterOnEnter={registerOnEnter}
					setAlias={setAlias}
					setPassword={setPassword}
				/>
				<div className="form-floating mb-3">
					<input
						type="file"
						className="d-inline-block py-5 px-4 form-control bottom"
						id="imageFileInput"
						onKeyDown={registerOnEnter}
						onChange={handleFileChange}
					/>
					{presenterRef.current!.imageUrl.length > 0 && (
						<>
							<label htmlFor="imageFileInput">User Image</label>
							<img src={presenterRef.current!.imageUrl} className="img-thumbnail" alt=""></img>
						</>
					)}
				</div>
			</>
		);
	};

	const switchAuthenticationMethodFactory = () => {
		return (
			<div className="mb-3">
				Already registered? <Link to="/login">Sign in</Link>
			</div>
		);
	};

	return (
		<AuthenticationFormLayout
			headingText="Please Register"
			submitButtonLabel="Register"
			oAuthHeading="Register with:"
			inputFieldFactory={inputFieldFactory}
			switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
			setRememberMe={setRememberMe}
			submitButtonDisabled={() =>
				presenterRef.current!.checkSubmitButtonStatus(firstName, lastName, password, alias)
			}
			isLoading={presenterRef.current!.isLoading}
			submit={() => presenterRef.current!.doRegister(firstName, lastName, password, alias, rememberMe)}
		/>
	);
};

export default Register;
