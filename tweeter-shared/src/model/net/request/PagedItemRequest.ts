import { AliasAuthRequest } from "./AliasAuthRequest";

export interface PagedItemRequest<T> extends AliasAuthRequest {
	readonly pageSize: number;
	readonly lastItem: T | null;
}
