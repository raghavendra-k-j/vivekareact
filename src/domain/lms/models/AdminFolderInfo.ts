import { JsonObj } from "~/core/types/Json";

export class AdminFolderInfo {
    public id: number;
    public name: string;
    public parent: AdminFolderInfo | null;

    constructor({ id, name, parent = null }: { id: number, name: string, parent: AdminFolderInfo | null }) {
        this.id = id;
        this.name = name;
        this.parent = parent;
    }

    static fromJson(json: JsonObj): AdminFolderInfo {
        return new AdminFolderInfo({
            id: Number(json.id),
            name: String(json.name),
            parent: json.parent ? AdminFolderInfo.fromJson(json.parent as JsonObj) : null
        });
    }

}