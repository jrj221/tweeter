import { StatusDTO } from "../dto/StatusDTO";
import { SQSMessage } from "./SQSMessage";

export interface PostStatusMessage extends SQSMessage {
	followeeAlias: string;
	statusDTO: StatusDTO;
	token: string;
}
