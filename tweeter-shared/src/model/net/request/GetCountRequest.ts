import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface GetCountRequest extends TweeterRequest {
	readonly token: string;
	readonly user: UserDTO;
}
