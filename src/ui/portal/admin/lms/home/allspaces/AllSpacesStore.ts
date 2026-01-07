import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";
import { AdminSpaceListReq } from "~/domain/lms/models/AdminSpaceListingModels";
import { SpaceType } from "~/domain/lms/models/SpaceType";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { EasyTableData, EasyTableState } from "~/ui/components/easytable/types";
import { SelectAllState } from "~/ui/utils/SelectAllState";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager/DialogManagerStore";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { adminLMSNavigateToCouse, adminLMSNavigateToFolder } from "../../utils/lmsUtils";
import { CreateSpaceDialog } from "../createspace/CreateSpaceDialog";
import { createSpaceDialogId } from "../createspace/CreateSpaceDialogContext";
import { RenameSpaceDialog } from "../renamespace/RenameSpaceDialog";
import { renameSpaceDialogId } from "../renamespace/RenameSpaceDialogContext";
import { DeleteSpaceDialog } from "../deletespaces/DeleteSpaceDialog";
import { deleteSpaceDialogId } from "../deletespaces/DeleteSpaceDialogContext";
import { AdminSpaceListVm } from "./models/AdminSpaceListVm";
import { aiCreateSpaceDialogId } from "../dialogIds";
import { AiCreateSpaceDialog } from "../aicreate/AiCreateSpaceDialog";


export class AllSpacesStore {


    dialogManager: DialogManagerStore;
    layoutStore: LMSLayoutStore;

    searchQuery: string = "";
    dataVmOpt: AdminSpaceListVm | null = null;
    queryState: EasyTableState<AdminSpaceItem> = EasyTableState.init<AdminSpaceItem>();

    pageSize: number = 10;
    currentPage: number = 1;
    selectedItemIds: Set<number> = new Set();
    currentFolderPermalink: string | null = null;

    constructor({ layoutStore, dialogManager, permalink }: {
        layoutStore: LMSLayoutStore,
        dialogManager: DialogManagerStore,
        permalink: string | null,
    }) {
        this.layoutStore = layoutStore;
        this.dialogManager = dialogManager;
        this.currentFolderPermalink = permalink;
        makeObservable(this, {
            queryState: observable.ref,
            dataVmOpt: observable.ref,
            searchQuery: observable,
            currentPage: observable,
            currentFolderPermalink: observable,
            pageSize: observable,
            selectedItemIds: observable.shallow,
            updateSearchQuery: action,
            changePage: action,
            changePageSize: action,
            toggleItemSelection: action,
            selectAllItems: action,
            clearSelection: action,
            selectAllState: computed,
        });
    }

    updateSearchQuery(query: string) {
        this.searchQuery = query;
    }

    changePage(page: number) {
        this.currentPage = page;
        this.loadItems({ page: page, parentPermalink: this.currentFolderPermalink });
    }

    changePageSize(size: number) {
        this.pageSize = size;
        this.currentPage = 1;
        this.loadItems({ page: 1, parentPermalink: this.currentFolderPermalink });
    }

    toggleItemSelection({ itemId, selected }: { itemId: number, selected?: boolean }) {
        if (selected === undefined) {
            if (this.selectedItemIds.has(itemId)) {
                this.selectedItemIds.delete(itemId);
            }
            else {
                this.selectedItemIds.add(itemId);
            }
        }
        else if (selected) {
            this.selectedItemIds.add(itemId);
        }
        else {
            this.selectedItemIds.delete(itemId);
        }
    }

    selectAllItems() {
        if (!this.queryState.isData) return;
        this.selectedItemIds.clear();
        this.listVm.items.forEach(item => {
            this.selectedItemIds.add(item.id);
        });
    }

    clearSelection() {
        this.selectedItemIds.clear();
    }

    get selectAllState(): SelectAllState {
        if (!this.queryState.isData) return SelectAllState.NONE;
        if (this.listVm.items.length === 0) return SelectAllState.NONE;
        if (this.selectedItemIds.size === 0) return SelectAllState.NONE;
        if (this.selectedItemIds.size === this.listVm.items.length) return SelectAllState.ALL;
        return SelectAllState.SOME;
    }

    get adminSpacesService(): AdminSpacesService {
        return this.layoutStore.adminSpacesService;
    }

    get listVm(): AdminSpaceListVm {
        return this.dataVmOpt!;
    }

    async loadItems({ page = 1, parentPermalink = null }: { page?: number, parentPermalink?: string | null } = {}) {
        console.log("AllSpacesStore: loadItems", { page, parentPermalink });
        try {
            runInAction(() => {
                this.queryState = EasyTableState.loading();
                this.currentPage = page;
            });
            const req = new AdminSpaceListReq({
                parentPermalink: parentPermalink,
                page: page,
                pageSize: this.pageSize,
                searchQuery: this.searchQuery.trim(),
            });
            const res = (await withMinDelay(this.adminSpacesService.querySpaces(req), 300)).getOrError();
            const vm = AdminSpaceListVm.fromModel(res);
            runInAction(() => {
                this.dataVmOpt = vm;
                const tableData = new EasyTableData({
                    items: vm.items,
                    currentPage: vm.pageInfo.page,
                    pageSize: vm.pageInfo.pageSize,
                    totalItems: vm.pageInfo.totalItems,
                });
                this.queryState = EasyTableState.data(tableData);
                this.currentFolderPermalink = parentPermalink || null;
            });
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.queryState = EasyTableState.error(appError);
            });
        }
    }

    reloadCurrentState(): void {
        this.loadItems({ page: this.currentPage, parentPermalink: this.currentFolderPermalink });
    }


    onClickTableRow(item: AdminSpaceItem) {
        if (item.type.isCourse) {
            this.navigateToCouse(item.permalink);
        }
        else {
            this.navigateToFolder(item.permalink);
        }
    }

    navigateToPermalink({ permalink, type }: { permalink: string | null, type: SpaceType }) {
        if (type.isCourse) {
            this.navigateToCouse(permalink!);
        }
        else {
            this.navigateToFolder(permalink);
        }
    }



    navigateToFolder(permalink: string | null) {
        adminLMSNavigateToFolder({
            folderPermalink: permalink,
            naviate: this.layoutStore.appStore.navigate
        });
    }

    showCreateDialog(type: SpaceType) {
        this.dialogManager.show({
            id: createSpaceDialogId,
            component: CreateSpaceDialog,
            props: {
                type,
                allSpacesStore: this,
                onClose: () => { this.dialogManager.closeById(createSpaceDialogId); }
            },
        });
    }

    showAiCreateDialog() {
        this.dialogManager.show({
            id: aiCreateSpaceDialogId,
            component: AiCreateSpaceDialog,
            props: {
                parentId: this.currentFolderPermalink,
                adminSpacesService: this.adminSpacesService,
                layoutStore: this.layoutStore,
                allSpacesStore: this,
            },
        });
    }

    navigateToCouse(permalink: string) {
        adminLMSNavigateToCouse({
            permalink,
            naviate: this.layoutStore.appStore.navigate
        });
    }

    showRenameDialog(item: AdminSpaceItem) {
        this.dialogManager.show({
            id: renameSpaceDialogId,
            component: RenameSpaceDialog,
            props: {
                item,
                allSpacesStore: this,
                onClose: () => { this.dialogManager.closeById(renameSpaceDialogId); }
            },
        });
    }

    showDeleteDialog(item: AdminSpaceItem) {
        this.dialogManager.show({
            id: deleteSpaceDialogId,
            component: DeleteSpaceDialog,
            props: {
                item,
                allSpacesStore: this,
                onClose: () => { this.dialogManager.closeById(deleteSpaceDialogId); }
            },
        });
    }

}