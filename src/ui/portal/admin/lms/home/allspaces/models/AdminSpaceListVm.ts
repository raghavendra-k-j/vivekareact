import { PageInfo } from "~/domain/common/models/PageInfo";
import { AdminFolderInfo } from "~/domain/lms/models/AdminFolderInfo";
import { AdminSpaceListRes } from "~/domain/lms/models/AdminQuerySpacesModels";
import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";

export class AdminSpaceListVm {
    pageInf: PageInfo;
    items: AdminSpaceItem[];
    folder: AdminFolderInfo | null;

    constructor(props: { pageInfo: PageInfo; items: AdminSpaceItem[]; folder: AdminFolderInfo | null }) {
        this.pageInf = props.pageInfo;
        this.items = props.items;
        this.folder = props.folder;
    }

    static fromModel(model: AdminSpaceListRes) {
        return new AdminSpaceListVm({
            pageInfo: model.pageInfo,
            items: model.items,
            folder: model.folder
        });
    }

}