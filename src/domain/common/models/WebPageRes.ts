import { JsonObj } from "~/core/types/Json";

export class WebPageRes {
  constructor(
    public readonly id: number,
    public readonly slug: string,
    public readonly title: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static fromJson(json: JsonObj): WebPageRes {
    return new WebPageRes(
      Number(json.id),
      json.slug as string,
      json.title as string,
      json.content as string,
      new Date(json.createdAt as string),
      new Date(json.updatedAt as string)
    );
  }
}
