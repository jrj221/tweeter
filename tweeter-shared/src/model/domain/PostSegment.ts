import { PostSegmentDTO } from "../dto/PostSegmentDTO";

export enum Type {
  text = "Text",
  alias = "Alias",
  url = "URL",
  newline = "Newline",
}

export class PostSegment {
  private _text: string;
  private _startPostion: number;
  private _endPosition: number;
  private _type: Type;

  public constructor(
    text: string,
    startPosition: number,
    endPosition: number,
    type: Type
  ) {
    this._text = text;
    this._startPostion = startPosition;
    this._endPosition = endPosition;
    this._type = type;
  }

  public get text(): string {
    return this._text;
  }

  public get startPostion(): number {
    return this._startPostion;
  }

  public get endPosition(): number {
    return this._endPosition;
  }

  public get type(): Type {
    return this._type;  
  }

  public get DTO(): PostSegmentDTO {
        return {
          text: this.text,
          startPosition: this.startPostion,
          endPosition: this.endPosition,
          type: this.type
        }
      } 
     
      public static fromDTO(dto: PostSegmentDTO | null): PostSegment | null {
        // dto.type should be one of these since it was a valid Type before sending as a request
          const type = dto?.type === "Text" ? Type.text : dto?.type === "Alias" ? Type.alias : dto?.type === "URL" ? Type.url : Type.newline;
          return dto === null ? null : new PostSegment(dto.text, dto.startPosition, dto.endPosition, type);
      }
}
