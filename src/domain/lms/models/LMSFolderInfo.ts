import { JsonObj } from "~/core/types/Json";

export class LMSFolderInfo {
    public id: number;
    public permalink: string;
    public name: string;
    public parent: LMSFolderInfo | null;

    constructor({ id, permalink,  name, parent = null }: { id: number, permalink: string, name: string, parent: LMSFolderInfo | null }) {
        this.id = id;
        this.permalink = permalink;
        this.name = name;
        this.parent = parent;
    }

    static fromJson(json: JsonObj): LMSFolderInfo {
        return new LMSFolderInfo({
            id: Number(json.id),
            permalink: String(json.permalink),
            name: String(json.name),
            parent: json.parent ? LMSFolderInfo.fromJson(json.parent as JsonObj) : null
        });
    }

}