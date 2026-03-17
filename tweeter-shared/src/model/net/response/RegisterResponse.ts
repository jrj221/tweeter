import { UserDTO } from "../../dto/UserDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface RegisterResponse extends TweeterResponse {
	readonly userDTO: UserDTO;
	readonly token: string;
}
