import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { LoginPresenter, LoginView } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();
  const [password, setPassword] = useState("");
  const [alias, setAlias] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const listener: LoginView = {
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: updateUserInfo,
    navigate: navigate,
  }

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new LoginPresenter(listener);
  }

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !presenterRef.current!.checkSubmitButtonStatus(alias, password)) {
      presenterRef.current!.doLogin(alias, password, props.originalUrl, rememberMe);
    }
  };

  const inputFieldFactory = () => {
    return (
      <>
        <AuthenticationFields loginOrRegisterOnEnter={loginOnEnter} setAlias={setAlias} setPassword={setPassword}/>
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() => presenterRef.current!.checkSubmitButtonStatus(alias, password)}
      isLoading={presenterRef.current!.isLoading}
      submit={() => presenterRef.current!.doLogin(alias, password, props.originalUrl, rememberMe)}
    />
  );
};

export default Login;
