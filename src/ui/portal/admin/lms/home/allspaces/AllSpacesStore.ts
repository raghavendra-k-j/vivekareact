import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminSpaceListReq } from "~/domain/lms/models/AdminQuerySpacesModels";
import { SpaceType } from "~/domain/lms/models/SpaceType";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DataState } from "~/ui/utils/DataState";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager/DialogManagerStore";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { CreateSpaceDialog } from "../createspace/CreateSpaceDialog";
import { createSpaceDialogId } from "../createspace/CreateSpaceDialogConst";
import { AdminSpaceListVm } from "./models/AdminSpaceListVm";
import { withMinDelay } from "~/infra/utils/withMinDelay";


export class AllSpacesStore {


    dialogManager: DialogManagerStore;
    layoutStore: LMSLayoutStore;

    searchQuery: string = "";
    queryState: DataState<AdminSpaceListVm> = DataState.init();
    pageSize: number = 50;

    constructor({ layoutStore, dialogManager }: { layoutStore: LMSLayoutStore, dialogManager: DialogManagerStore }) {
        this.layoutStore = layoutStore;
        this.dialogManager = dialogManager;
        makeObservable(this, {
            queryState: observable.ref,
            searchQuery: observable,
        });
    }

    get adminSpacesService(): AdminSpacesService {
        return this.layoutStore.adminSpacesService;
    }

    get listVm(): AdminSpaceListVm {
        return this.queryState.data!;
    }

    get currentFolderId(): number | null {
        return this.listVm.folder != null ? this.listVm.folder.id : null;
    }

    async loadItems({ page = 1, parentId = null }: { page?: number, parentId?: number | null } = {}) {
        try {
            runInAction(() => {
                this.queryState = DataState.loading();
            });
            const req = new AdminSpaceListReq({
                parentId: parentId,
                page: page,
                pageSize: this.pageSize,
                searchQuery: null
            });
            const res = (await withMinDelay(this.adminSpacesService.querySpaces(req), 300)).getOrError();
            const vm = AdminSpaceListVm.fromModel(res);
            runInAction(() => {
                this.queryState = DataState.data(vm);
            });
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.queryState = DataState.error(appError);
            });
        }
    }

    navigateToFolder(id: number | null) {
        this.loadItems({ parentId: id, page: 1 });
    }

    showCreateDialog(type: SpaceType) {
        this.dialogManager.show({
            id: createSpaceDialogId,
            component: CreateSpaceDialog,
            props: {
                type,
                parentId: this.currentFolderId,
                adminSpacesService: this.adminSpacesService,
                layoutStore: this.layoutStore,
                allSpacesStore: this,
            },
        });
    }

    reloadCurrentFolder() {
        this.loadItems({ parentId: this.currentFolderId, page: 1 });
    }

}