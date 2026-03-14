import { UserDTO } from "./UserDTO";
import { PostSegmentDTO } from "./PostSegmentDTO";

export interface StatusDTO {
    readonly post: string;
    readonly user: UserDTO;
    readonly timestamp: number;
    readonly segments: PostSegmentDTO[];
}