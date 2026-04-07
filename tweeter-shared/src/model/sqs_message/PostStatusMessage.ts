import { StatusDTO } from "../dto/StatusDTO";

export interface PostStatusMessage {
	followeeAlias: string;
	statusDTO: StatusDTO;
}
