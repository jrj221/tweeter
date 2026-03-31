import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowActionRequest extends TweeterRequest {
	readonly token: string;
	readonly user: UserDTO;
	readonly targetUser: UserDTO;
}
