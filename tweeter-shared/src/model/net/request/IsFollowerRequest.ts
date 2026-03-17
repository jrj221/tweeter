import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface IsFollowerRequest extends TweeterRequest {
	readonly token: string;
	readonly user: UserDTO;
	readonly selectedUser: UserDTO;
}
