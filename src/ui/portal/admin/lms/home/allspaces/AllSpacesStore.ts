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
import { AiCreateSpaceDialog } from "../aicreate/AiCreateSpaceDialog";
import { aiCreateSpaceDialogId } from "../aicreate/AiCreateSpaceDialogConst";
import { AdminSpaceListVm } from "./models/AdminSpaceListVm";
import { withMinDelay } from "~/infra/utils/withMinDelay";


export class AllSpacesStore {
    


    dialogManager: DialogManagerStore;
    layoutStore: LMSLayoutStore;
    navigate: (path: string) => void;

    searchQuery: string = "";
    queryState: DataState<AdminSpaceListVm> = DataState.init();
    pageSize: number = 50;

    constructor({ layoutStore, dialogManager, navigate }: { 
        layoutStore: LMSLayoutStore, 
        dialogManager: DialogManagerStore,
        navigate: (path: string) => void
    }) {
        this.layoutStore = layoutStore;
        this.dialogManager = dialogManager;
        this.navigate = navigate;
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
        if (id === null) {
            this.navigate('/console/lms/spaces');
        } else {
            this.navigate(`/console/lms/spaces/${id}`);
        }
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

    showAiCreateDialog() {
        this.dialogManager.show({
            id: aiCreateSpaceDialogId,
            component: AiCreateSpaceDialog,
            props: {
                parentId: this.currentFolderId,
                adminSpacesService: this.adminSpacesService,
                layoutStore: this.layoutStore,
                allSpacesStore: this,
            },
        });
    }

    reloadCurrentFolder(folderId?: number | null) {
        const parentId = folderId !== undefined ? folderId : this.currentFolderId;
        this.loadItems({ parentId: parentId, page: 1 });
    }

    navigateToCouse(id: number) {
        this.navigate(`/console/lms/courses/${id}/content`);
    }

}