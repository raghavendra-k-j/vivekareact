import { SpaceType } from "./SpaceType";
import { JsonObj } from "~/core/types/Json";

export class AiSpacesCreatorReq {
    public userPrompt: string;
    public parentId: number | null;

    constructor({ userPrompt, parentId }: { userPrompt: string; parentId: number | null }) {
        this.userPrompt = userPrompt;
        this.parentId = parentId;
    }

    public static fromJson(json: any): AiSpacesCreatorReq {
        return new AiSpacesCreatorReq(
            {
                userPrompt: json.userPrompt,
                parentId: json.parentId
            }
        );
    }

    public toJson(): JsonObj {
        return {
            userPrompt: this.userPrompt,
            parentId: this.parentId
        };
    }
}

export class AiSpaceItem {
    public type: SpaceType;
    public name: string;
    public children: AiSpaceItem[];

    constructor(type: SpaceType, name: string, children: AiSpaceItem[] = []) {
        this.type = type;
        this.name = name;
        this.children = children;
    }

    public static fromJson(json: any): AiSpaceItem {
        const children = json.children ? json.children.map((child: any) => AiSpaceItem.fromJson(child)) : [];
        return new AiSpaceItem(SpaceType.fromValue(json.type), json.name, children);
    }

    public toJson(): JsonObj {
        return {
            type: this.type.type,
            name: this.name,
            children: this.children.map(child => child.toJson())
        };
    }
}

export class AiSpacesCreatorRes {
    public message: string | null;
    public items: AiSpaceItem[];

    constructor({ message, items }: { message: string | null; items: AiSpaceItem[] }) {
        this.message = message;
        this.items = items;
    }

    public static fromJson(json: JsonObj): AiSpacesCreatorRes {
        const message = json.message ? String(json.message) : null;
        const items = json.items ? json.items.map((item: JsonObj) => AiSpaceItem.fromJson(item)) : [];
        return new AiSpacesCreatorRes({ message, items });
    }

    public toJson(): JsonObj {
        return {
            message: this.message,
            items: this.items.map(item => item.toJson())
        };
    }
}