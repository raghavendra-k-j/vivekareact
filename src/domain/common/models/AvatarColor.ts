import { JsonObj } from "~/core/types/Json";

export class AvatarColor {
    public bgColor: string;
    public fgColor: string;

    constructor({ bgColor, fgColor }: { bgColor: string; fgColor: string }) {
        this.bgColor = bgColor;
        this.fgColor = fgColor;
    }

    static fromJson(json: JsonObj): AvatarColor {
        return new AvatarColor({
            bgColor: String(json.bgColor),
            fgColor: String(json.fgColor)
        });
    }

    toJson(): JsonObj {
        return {
            bgColor: this.bgColor,
            fgColor: this.fgColor
        };
    }
}