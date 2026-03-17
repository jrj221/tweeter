import { UserDTO } from "../../dto/UserDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface LoginResponse extends TweeterResponse {
	userDTO: UserDTO;
	token: string;
}
