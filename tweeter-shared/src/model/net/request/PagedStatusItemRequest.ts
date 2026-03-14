import { StatusDTO } from "../../dto/StatusDTO";
import { PagedItemRequest } from "./PagedItemRequest";

export interface PagedStatusItemRequest extends PagedItemRequest<StatusDTO> {}
