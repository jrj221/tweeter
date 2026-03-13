import { UserDTO } from "../../dto/UserDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface PagedUserItemResponse extends TweeterResponse {
    readonly items: UserDTO[] | null;
    readonly hasMoreItems: boolean;
}
    