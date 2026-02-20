import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { AppPresenter, AppView } from "./presenter/AppPresenter";
import { useRef } from "react";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import StatusItem from "./components/items/statusItem/StatusItem";
import { useMessageActions } from "./components/toaster/MessageHooks";
import ItemScroller from "./components/mainLayout/ItemScroller";
import UserItem from "./components/items/userItem/UserItem";

const App = () => {
	const { currentUser, authToken } = useUserInfo();
	const { displayErrorMessage } = useMessageActions();

	const listener: AppView = {
		displayErrorMessage: displayErrorMessage, // stupid that i have to import just to satisfy View
	};

	const presenterRef = useRef<AppPresenter | null>(null);
	if (!presenterRef.current) {
		presenterRef.current = new AppPresenter(listener);
	}

	return (
		<div>
			<Toaster position="top-right" />
			<BrowserRouter>
				{presenterRef.current!.isAuthenticated(currentUser, authToken) ? (
					<AuthenticatedRoutes />
				) : (
					<UnauthenticatedRoutes />
				)}
			</BrowserRouter>
		</div>
	);
};

const AuthenticatedRoutes = () => {
	const { displayedUser } = useUserInfo();

	const generateUserItemComponent = (item: User, featureURL: string): JSX.Element => {
		return <UserItem user={item} featurePath={featureURL} />;
	};

	const generateStatusItemComponent = (item: Status, featureURL: string): JSX.Element => {
		return <StatusItem status={item} featureUrl={featureURL} />;
	};

	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
				<Route
					path="feed/:displayedUser"
					element={
						<ItemScroller
							key={`feed-${displayedUser!.alias}`}
							featureURL="/feed"
							presenterFactory={(view: PagedItemView<Status>) => new FeedPresenter(view)}
							itemComponentFactory={(item: Status, featureURL: string) => {
								return generateStatusItemComponent(item, featureURL);
							}}
						/>
					}
				/>
				<Route
					path="story/:displayedUser"
					element={
						<ItemScroller
							key={`story-${displayedUser!.alias}`}
							featureURL="/story"
							presenterFactory={(view: PagedItemView<Status>) => new StoryPresenter(view)}
							itemComponentFactory={(item: Status, featureURL: string) => {
								return generateStatusItemComponent(item, featureURL);
							}}
						/>
					}
				/>
				<Route
					path="followees/:displayedUser"
					element={
						<ItemScroller
							key={`followees-${displayedUser!.alias}`}
							featureURL="/followees"
							presenterFactory={(view: PagedItemView<User>) => new FolloweePresenter(view)}
							itemComponentFactory={(item: User, featureURL: string) => {
								return generateUserItemComponent(item, featureURL);
							}}
						/>
					}
				/>
				<Route
					path="followers/:displayedUser"
					element={
						<ItemScroller
							key={`followers-${displayedUser!.alias}`}
							featureURL="/followers"
							presenterFactory={(view: PagedItemView<User>) => new FollowerPresenter(view)}
							itemComponentFactory={(item: User, featureURL: string) => {
								return generateUserItemComponent(item, featureURL);
							}}
						/>
					}
				/>
				<Route path="logout" element={<Navigate to="/login" />} />
				<Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
			</Route>
		</Routes>
	);
};

const UnauthenticatedRoutes = () => {
	const location = useLocation();

	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="*" element={<Login originalUrl={location.pathname} />} />
		</Routes>
	);
};

export default App;
