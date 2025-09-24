import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { CreateSpaceReq, CreateSpaceRes } from "~/domain/lms/models/CreateSpaceModels";
import { SpaceType } from "~/domain/lms/models/SpaceType";
import { DataState } from "~/ui/utils/DataState";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { InputValuesUtil } from "~/ui/widgets/form/InputValueUtil";
import { showErrorToast } from "~/ui/widgets/toast/toast";
import { validateInternalName, validateSpaceName } from "../../utils/spaceValidation";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";

export class CreateSpaceDialogStore {

    allSpacesStore: AllSpacesStore;
    onClose: () => void;

    nameField: InputValue<string> = new InputValue("");
    internalNameField: InputValue<string> = new InputValue("");
    type: SpaceType;
    showAdditionalFields: boolean = false;

    createState: DataState<CreateSpaceRes> = DataState.init();

    get layoutStore() {
        return this.allSpacesStore.layoutStore;
    }

    get adminSpacesService() {
        return this.layoutStore.adminSpacesService;
    }

    get dialogManager() {
        return this.layoutStore.portalLayoutStore.dialogManager;
    }

    get parentId(): number | null {
        if (this.allSpacesStore.currentFolderPermalink != null) {
            return this.allSpacesStore.dataVmOpt!.folder?.id || null;
        }
        return null;
    }

    constructor({ allSpacesStore, type, onClose }: { allSpacesStore: AllSpacesStore; type: SpaceType; onClose: () => void }) {
        this.onClose = onClose;
        this.allSpacesStore = allSpacesStore;
        this.type = type;
        this.nameField.validator = (value) => validateSpaceName({ value: value, label: this.typeLabel });
        this.internalNameField.validator = (value) => validateInternalName({ value: value, label: `${this.typeLabel} internal name` });
        makeObservable(this, {
            createState: observable.ref,
            showAdditionalFields: observable,
        });
    }

    get typeLabel(): string {
        if (this.type.isFolder) {
            return this.type.label;
        }
        return this.layoutStore.courseEd.namePlural;
    }


    toggleAdditionalFields(): void {
        runInAction(() => {
            this.showAdditionalFields = !this.showAdditionalFields;
        });
    }

    async createSpace() {
        const fieldsToValidate = [this.nameField];
        if (this.showAdditionalFields) {
            fieldsToValidate.push(this.internalNameField);
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
                internalName: this.internalNameField.value.trim(),
                type: this.type,
                parentId: this.parentId,
                avatarColor: null
            });
            const res = (await this.adminSpacesService.createSpace(req)).getOrError();
            runInAction(() => {
                this.createState = DataState.data(res);
            });

            // Navigate to the newly created folder if it's a folder
            this.allSpacesStore.navigateToPermalink({ permalink: res.permalink, type: this.type });
            this.onClose();
            this.allSpacesStore.reloadCurrentState();
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.createState = DataState.error(appError);
            });
        }
    }

}