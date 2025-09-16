import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { CreateSpaceReq, CreateSpaceRes } from "~/domain/lms/models/CreateSpaceModels";
import { LMSConst } from "~/domain/lms/models/LMSConst";
import { SpaceType } from "~/domain/lms/models/SpaceType";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DataState } from "~/ui/utils/DataState";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager/DialogManagerStore";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { InputValuesUtil } from "~/ui/widgets/form/InputValueUtil";
import { showErrorToast } from "~/ui/widgets/toast/toast";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { validateInternalName, validateSpaceCode, validateSpaceName } from "../../utils/space_validators";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";
import { createSpaceDialogId } from "./CreateSpaceDialogConst";

export class CreateSpaceDialogStore {
    
    layoutStore: LMSLayoutStore;
    allSpacesStore: AllSpacesStore;
    adminSpacesService: AdminSpacesService;
    dialogManager: DialogManagerStore;
    parentId: number | null = null;

    nameField: InputValue<string> = new InputValue("");
    internalNameField: InputValue<string> = new InputValue("");
    codeField: InputValue<string> = new InputValue("");
    type: SpaceType;
    showAdditionalFields: boolean = false;

    createState: DataState<CreateSpaceRes> = DataState.init();

    constructor({ layoutStore, allSpacesStore, adminSpacesService,
        dialogManager,
        type, parentId, }: {
            layoutStore: LMSLayoutStore;
            allSpacesStore: AllSpacesStore;
            adminSpacesService: AdminSpacesService;
            dialogManager: DialogManagerStore;
            type: SpaceType;
            parentId: number | null;
        }) {
        this.layoutStore = layoutStore;
        this.allSpacesStore = allSpacesStore;
        this.adminSpacesService = adminSpacesService;
        this.dialogManager = dialogManager;
        this.type = type;
        this.parentId = parentId;
        this.nameField.validator = (value) => validateSpaceName({ value: value, label: this.typeLabel });
        this.internalNameField.validator = (value) => validateInternalName({ value: value, label: `${this.typeLabel} internal name` });
        this.codeField.validator = (value) => validateSpaceCode({ value: value, label: `${this.typeLabel} code` });
        makeObservable(this, {
            createState: observable.ref,
            showAdditionalFields: observable,
        });
    }

    get typeLabel(): string {
        if (this.type.isCourse) {
            return this.layoutStore.entity(LMSConst.ENTITY_COURSE_ID).namePlural;
        }
        else {
            return this.type.label;
        }
    }

    toggleAdditionalFields(): void {
        runInAction(() => {
            this.showAdditionalFields = !this.showAdditionalFields;
        });
    }

    async createSpace() {
        const fieldsToValidate = [this.nameField];
        if (this.type.isCourse) {
            fieldsToValidate.push(this.internalNameField, this.codeField);
        }
        const isValid = InputValuesUtil.validateAll(fieldsToValidate);
        if (!isValid) {
            showErrorToast({
                message: "Please fix the errors in the form.",
            });
            return;
        }
        try {
            runInAction(() => {
                this.createState = DataState.loading();
            });
            const req = new CreateSpaceReq({
                name: this.nameField.value.trim(),
                internalName: this.internalNameField.value.trim() || null,
                code: this.codeField.value.trim() || null,
                type: this.type,
                parentId: this.parentId
            });
            const res = (await this.adminSpacesService.createSpace(req)).getOrError();
            runInAction(() => {
                this.createState = DataState.data(res);
            });
            
            // Navigate to the newly created folder if it's a folder
            if (this.type.isFolder) {
                this.allSpacesStore.navigateToFolder(res.id);
            } else {
                this.allSpacesStore.reloadCurrentFolder();
            }
            
            this.dialogManager.closeById(createSpaceDialogId);
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.createState = DataState.error(appError);
            });
        }
    }

    closeDialog(): void {
        this.dialogManager.closeById(createSpaceDialogId);
    }

}