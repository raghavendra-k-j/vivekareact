import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AiSpacesCreatorReq, AiSpacesCreatorRes, AiSpaceItem } from "~/domain/lms/models/AiSpacesCreatorModels";
import { CreateSpaceReq } from "~/domain/lms/models/CreateSpaceModels";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DataState } from "~/ui/utils/DataState";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager/DialogManagerStore";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { InputValuesUtil } from "~/ui/widgets/form/InputValueUtil";
import { showErrorToast, showSuccessToast } from "~/ui/widgets/toast/toast";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";
import { aiCreateSpaceDialogId } from "./AiCreateSpaceDialogConst";

export type ChatMessage = {
    id: string;
    type: 'user' | 'ai' | 'system';
    content: string;
    timestamp: Date;
    structure?: AiSpacesCreatorRes;
};

export class AiCreateSpaceDialogStore {
    
    layoutStore: LMSLayoutStore;
    allSpacesStore: AllSpacesStore;
    adminSpacesService: AdminSpacesService;
    dialogManager: DialogManagerStore;
    parentId: number | null = null;

    promptField: InputValue<string> = new InputValue("");
    
    generateState: DataState<AiSpacesCreatorRes> = DataState.init();
    createState: DataState<void> = DataState.init();
    generatedStructure: AiSpacesCreatorRes | null = null;
    
    conversationHistory: ChatMessage[] = [];

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
        
        this.promptField.validator = (value) => {
            if (!value || value.trim().length === 0) {
                return "Please enter a prompt for AI to generate the space structure";
            }
            if (value.trim().length < 10) {
                return "Please provide a more detailed prompt (at least 10 characters)";
            }
            return null;
        };

        makeObservable(this, {
            generateState: observable.ref,
            createState: observable.ref,
            generatedStructure: observable,
            conversationHistory: observable,
        });
    }

    async generateStructure(): Promise<void> {
        const isValid = InputValuesUtil.validateAll([this.promptField]);
        if (!isValid) {
            showErrorToast({
                message: "Please fix the errors in the form.",
            });
            return;
        }

        const userMessage: ChatMessage = {
            id: this.generateMessageId(),
            type: 'user',
            content: this.promptField.value.trim(),
            timestamp: new Date(),
        };

        runInAction(() => {
            this.conversationHistory.push(userMessage);
            this.generateState = DataState.loading();
        });

        try {
            const req = new AiSpacesCreatorReq(
                this.promptField.value.trim(),
                this.parentId || 0
            );

            const res = (await this.adminSpacesService.aiGenerateSpaceStructure(req)).getOrError();
            
            const aiMessage: ChatMessage = {
                id: this.generateMessageId(),
                type: 'ai',
                content: res.message,
                timestamp: new Date(),
                structure: res,
            };

            runInAction(() => {
                this.generateState = DataState.data(res);
                this.generatedStructure = res;
                this.conversationHistory.push(aiMessage);
                this.promptField.set(""); // Clear the input field
            });

            showSuccessToast({
                message: "AI structure generated successfully!",
            });

        } catch (error) {
            const appError = AppError.fromAny(error);
            
            const errorMessage: ChatMessage = {
                id: this.generateMessageId(),
                type: 'ai',
                content: `Sorry, I encountered an error: ${appError.message || "Failed to generate structure"}`,
                timestamp: new Date(),
            };

            runInAction(() => {
                this.generateState = DataState.error(appError);
                this.conversationHistory.push(errorMessage);
                this.promptField.set(""); // Clear the input field
            });
            showErrorToast({
                message: appError.message || "Failed to generate AI structure",
            });
        }
    }

    async createStructure(): Promise<void> {
        if (!this.generatedStructure) {
            showErrorToast({
                message: "No structure to create. Please generate a structure first.",
            });
            return;
        }

        try {
            runInAction(() => {
                this.createState = DataState.loading();
            });

            // Recursively create spaces based on the AI-generated structure
            await this.createSpacesRecursively(this.generatedStructure.items, this.parentId);
            
            runInAction(() => {
                this.createState = DataState.init();
            });

            showSuccessToast({
                message: "AI-generated space structure created successfully!",
            });
            
            // Reload the current folder to show newly created spaces
            this.allSpacesStore.reloadCurrentFolder();
            
            this.closeDialog();
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.createState = DataState.error(appError);
            });
            showErrorToast({
                message: appError.message || "Failed to create structure",
            });
        }
    }

    private async createSpacesRecursively(items: AiSpaceItem[], parentId: number | null): Promise<void> {
        for (const item of items) {
            try {
                // Create the current space
                const createReq = new CreateSpaceReq({
                    name: item.name,
                    type: item.type,
                    parentId: parentId,
                    internalName: null,
                    code: null
                });

                const createRes = (await this.adminSpacesService.createSpace(createReq)).getOrError();
                
                // If this space has children, create them recursively
                if (item.children && item.children.length > 0) {
                    await this.createSpacesRecursively(item.children, createRes.id);
                }
            } catch (error) {
                // Log the error for the specific item but continue with others
                console.error(`Failed to create space "${item.name}":`, error);
                throw error; // Re-throw to stop the entire process if any creation fails
            }
        }
    }

    clearGenerated(): void {
        runInAction(() => {
            this.generatedStructure = null;
            this.generateState = DataState.init();
        });
    }

    private generateMessageId(): string {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    closeDialog(): void {
        this.dialogManager.closeById(aiCreateSpaceDialogId);
    }

    get hasGeneratedStructure(): boolean {
        return this.generatedStructure !== null;
    }

    get canCreateStructure(): boolean {
        return this.hasGeneratedStructure && !this.generateState.isLoading && !this.createState.isLoading;
    }
}