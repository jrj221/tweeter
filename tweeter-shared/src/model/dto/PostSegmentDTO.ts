export interface PostSegmentDTO {
    readonly text: string;
    readonly startPosition: number;
    readonly endPosition: number;
    readonly type: string; // Originally has an enum type
}