import { StatusDTO } from "../dto/StatusDTO";

export interface UpdateFeedMessage {
	followees: string[];
	statusDTO: StatusDTO;
	token: string;
}
