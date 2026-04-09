import { StatusDTO } from "../dto/StatusDTO";

export interface UpdateFeedMessage {
	followerAliases: string[];
	statusDTO: StatusDTO;
	token: string;
}
