import { UserDTO } from "../../dto/UserDTO";
import { PagedItemResponse } from "./PagedItemResponse";

export interface PagedUserItemResponse extends PagedItemResponse<UserDTO> {}
