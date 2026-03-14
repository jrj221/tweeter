import { StatusDTO } from "../../dto/StatusDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface PagedStatusItemResponse extends TweeterResponse {
    readonly items: StatusDTO[] | null;
    readonly hasMoreItems: boolean;
}