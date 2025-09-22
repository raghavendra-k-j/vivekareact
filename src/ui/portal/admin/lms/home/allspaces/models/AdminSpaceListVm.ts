import { PageInfo } from "~/domain/common/models/PageInfo";
import { LMSFolderInfo } from "~/domain/lms/models/LMSFolderInfo";
import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";
import { AdminSpaceListRes } from "~/domain/lms/models/AdminSpaceListingModels";

export class AdminSpaceListVm {
    pageInfo: PageInfo;
    items: AdminSpaceItem[];
    folder: LMSFolderInfo | null;

    constructor(props: { pageInfo: PageInfo; items: AdminSpaceItem[]; folder: LMSFolderInfo | null }) {
        this.pageInfo = props.pageInfo;
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