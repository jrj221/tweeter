import { UserDTO } from "../../dto/UserDTO";
import { AliasAuthRequest } from "./AliasAuthRequest";

export interface PagedUserItemRequest extends AliasAuthRequest {
	readonly pageSize: number;
	readonly lastItem: UserDTO | null;
}
