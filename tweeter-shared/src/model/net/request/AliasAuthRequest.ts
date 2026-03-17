import { TweeterRequest } from "./TweeterRequest";

export interface AliasAuthRequest extends TweeterRequest {
	alias: string;
	token: string;
}
