import { action, makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AiSpacesCreatorReq } from "~/domain/lms/models/AiSpacesCreatorModels";
import { CreateSpaceReq } from "~/domain/lms/models/CreateSpaceModels";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DataState } from "~/ui/utils/DataState";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager/DialogManagerStore";
import { showErrorToast, showSuccessToast } from "~/ui/widgets/toast/toast";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";
import { AiSpaceItemVm, AiSpacesCreatorResVm } from "./models/AiSpacesCreatorResVm";
import { aiCreateSpaceDialogId } from "../dialogIds";

export class AiCreateSpaceDialogStore {
    layoutStore: LMSLayoutStore;
    allSpacesStore: AllSpacesStore;
    adminSpacesService: AdminSpacesService;
    dialogManager: DialogManagerStore;
    parentId: number | null = null;

    promptString: string = "";
    promptError: string | null = null;

    generateState: DataState<AiSpacesCreatorResVm> = DataState.init();
    createState: DataState<void> = DataState.init();

    private promptMinLength = 10;
    private promptMaxLength = 400;

    constructor({
        layoutStore,
        allSpacesStore,
        adminSpacesService,
        dialogManager,
        parentId,
    }: {
        layoutStore: LMSLayoutStore;
        allSpacesStore: AllSpacesStore;
        adminSpacesService: AdminSpacesService;
        dialogManager: DialogManagerStore;
        parentId: number | null;
    }) {
        this.layoutStore = layoutStore;
        this.allSpacesStore = allSpacesStore;
        this.adminSpacesService = adminSpacesService;
        this.dialogManager = dialogManager;
        this.parentId = parentId;

        makeObservable(this, {
            generateState: observable.ref,
            createState: observable.ref,
            promptString: observable,
            promptError: observable,
            updatePrompt: action,
            validatePromptInput: action,
        });
    }

    // -------------------------------
    // Prompt Handling
    // -------------------------------
    updatePrompt(value: string): void {
        this.promptString = value;
        this.validatePromptInput();
    }

    validatePromptInput(): boolean {
        this.promptError = null;
        const length = this.promptString.trim().length;
        if (length < this.promptMinLength) {
            this.promptError = `Please provide a more detailed prompt (at least ${this.promptMinLength} characters).`;
            return false;
        }
        if (length > this.promptMaxLength) {
            this.promptError = `Prompt exceeds maximum length of ${this.promptMaxLength} characters.`;
            return false;
        }
        this.promptError = null;
        return true;
    }

    get canGenerateStructure(): boolean {
        return this.promptString.trim().length >= this.promptMinLength && !this.generateState.isLoading;
    }

    get isInputScreen(): boolean {
        return this.generateState.isInit;
    }

    get isOutputScreen(): boolean {
        return !this.generateState.isInit;
    }


    resetToPromptView(): void {
        runInAction(() => {
            this.generateState = DataState.init();
            this.createState = DataState.init();
        });
    }

    // -------------------------------
    // Generation Flow
    // -------------------------------
    async generateStructureFromPrompt(): Promise<void> {
        const isValid = this.validatePromptInput();
        if (!isValid) return;

        try {
            runInAction(() => {
                this.generateState = DataState.loading();
            });

            const req = new AiSpacesCreatorReq({
                userPrompt: this.promptString,
                parentId: this.parentId,
            });


            const res = (await this.adminSpacesService.aiGenerateSpaceStructure(req)).getOrError();
            const vm = AiSpacesCreatorResVm.fromModel(res);

            runInAction(() => {
                this.generateState = DataState.data(vm);
            });
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.generateState = DataState.error(appError);
            });
            showErrorToast({
                message: appError.message,
                description: appError.description,
            });
        }
    }

    // -------------------------------
    // Creation Flow
    // -------------------------------
    async startStructureCreation(): Promise<void> {
        return this.executeStructureCreation("create");
    }

    async retryStructureCreation(): Promise<void> {
        return this.executeStructureCreation("retry");
    }

    private async executeStructureCreation(mode: "create" | "retry"): Promise<void> {
        if (!this.hasGeneratedItems) {
            showErrorToast({ message: "No items to create" });
            return;
        }
        if (this.createState.isLoading) {
            return; // avoid parallel runs
        }
        if (mode === "create" && this.createState.isData) {
            return; // already created
        }

        try {
            runInAction(() => {
                this.createState = DataState.loading();
            });

            await this.createSpacesRecursive({ items: this.generatedItems, parentId: this.parentId });

            runInAction(() => {
                this.createState = DataState.data(undefined);
            });

            this.allSpacesStore.reloadCurrentFolder();
            showSuccessToast({ message: "Items created successfully" });
            this.closeDialog();
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.createState = DataState.error(appError);
            });
            showErrorToast({
                message: appError.message,
                description: appError.description,
            });
        }
    }

    private async createSpacesRecursive({ items, parentId }: { items: AiSpaceItemVm[]; parentId: number | null }): Promise<void> {
        for (const itemVm of items) {
            try {
                let currentItemId: number | null = (itemVm as any).createdId as number | null;

                if (currentItemId == null) {
                    if (itemVm.createState.isLoading) {
                        throw new Error("Creation already in progress for an item");
                    }

                    runInAction(() => {
                        itemVm.setCreating();
                    });

                    const createReq = new CreateSpaceReq({
                        name: itemVm.name,
                        type: itemVm.type,
                        parentId: parentId,
                        internalName: null,
                        avatarColor: null,
                    });

                    const createRes = (await this.adminSpacesService.createSpace(createReq)).getOrError();

                    runInAction(() => {
                        itemVm.setCreated(createRes.id);
                    });

                    currentItemId = createRes.id;
                }

                if (itemVm.children && itemVm.children.length > 0) {
                    await this.createSpacesRecursive({ items: itemVm.children, parentId: currentItemId });
                }
            } catch (error) {
                const appError = AppError.fromAny(error);
                runInAction(() => {
                    itemVm.setCreateError(appError);
                });
                showErrorToast({
                    message: appError.message,
                    description: appError.description,
                });
                throw error; // stop at first failure
            }
        }
    }

    // -------------------------------
    // Dialog / State Getters
    // -------------------------------
    closeDialog(): void {
        this.dialogManager.closeById(aiCreateSpaceDialogId);
    }

    get isStructureGenerated(): boolean {
        return this.generateState.isData;
    }

    get canStartCreation(): boolean {
        return this.isStructureGenerated && !this.generateState.isLoading && !this.createState.isLoading;
    }

    get generatedItems() {
        return this.generateState.data!.items;
    }

    get hasGeneratedItems() {
        return this.generateState.isData && this.generateState.data!.items.length > 0;
    }
}
