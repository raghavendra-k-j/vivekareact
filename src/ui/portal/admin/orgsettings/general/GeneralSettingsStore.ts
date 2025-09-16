import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { validateOrgName } from "~/domain/common/services/OrgDetailsValidator";
import { OrgGeneralSettingsRes, SaveGeneralSettingsReq } from "~/domain/orgsettings/models/OrgGeneralSettingsRes";
import { UploadLogoRes } from "~/domain/orgsettings/models/UploadLogoRes";
import { DataState } from "~/ui/utils/DataState";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { InputValuesUtil } from "~/ui/widgets/form/InputValueUtil";
import { showErrorToast, showSuccessToast } from "~/ui/widgets/toast/toast";
import { OrgSettingsStore } from "../layout/OrgSettingsStore";

function extensionFromName(name: string | undefined | null): string | null {
    if (!name) return null;
    const parts = name.split(".");
    if (parts.length < 2) return null;
    return parts[parts.length - 1].toLowerCase();
}

function mapExtensionsToAccept(exts: string[]): string {
    const set = new Set<string>();
    for (const e of exts) {
        const ext = e.toLowerCase();
        if (ext === "jpg" || ext === "jpeg") set.add("image/jpeg");
        else if (ext === "png") set.add("image/png");
        else if (ext === "webp") set.add("image/webp");
        else if (ext === "gif") set.add("image/gif");
        else set.add("." + ext);
    }
    return Array.from(set).join(",");
}

export class GeneralSettingsStore {
    saveLogoSatete: DataState<UploadLogoRes> = DataState.init();
    saveSettingsState: DataState<OrgGeneralSettingsRes> = DataState.init();
    selectedFile: File | null = null;
    previewUrl: string | null = null;
    orgNameField: InputValue<string> = new InputValue("");
    subDomainField: InputValue<string> = new InputValue("");
    layoutStore: OrgSettingsStore;

    constructor({ layoutStore }: { layoutStore: OrgSettingsStore }) {
        this.layoutStore = layoutStore;
        this.orgNameField.value = this.layoutStore.orgSettings.orgName;
        this.subDomainField.value = this.layoutStore.orgSettings.subdomain;
        this.initValidators();
        makeObservable(this, {
            saveLogoSatete: observable.ref,
            saveSettingsState: observable.ref,
            selectedFile: observable.ref,
            previewUrl: observable.ref,
        });
    }

    get orgSettings(): OrgGeneralSettingsRes {
        return this.layoutStore.orgSettings;
    }

    initValidators() {
        this.orgNameField.validator = (value) => {
            return validateOrgName(value, {
                minLength: this.orgSettings.validationData.orgNameMinLength,
                maxLength: this.orgSettings.validationData.orgNameMaxLength,
            });
        };
    }

    onClickChooseFile() {
        const exts = this.orgSettings.validationData.logoAllowedExtensions || [];
        const accept = exts.length ? mapExtensionsToAccept(exts) : "image/*";
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            const file = target.files ? target.files[0] : null;
            this.onFileChoosed(file);
        };
        input.click();
        input.remove();
    }

    onFileChoosed(file: File | null) {
        if (!file) {
            return;
        }
        const exts = this.orgSettings.validationData.logoAllowedExtensions || [];
        const maxBytes = this.orgSettings.validationData.logoMaxSizeInBytes ?? Infinity;
        const ext = extensionFromName(file.name);
        if (exts.length && (!ext || !exts.map(e => e.toLowerCase()).includes(ext))) {
            showErrorToast({
                message: `Invalid file type. Allowed: ${exts.join(", ")}`
            });
            return;
        }
        if (file.size > maxBytes) {
            const mb = Math.round(maxBytes / 1024 / 1024);
            showErrorToast({
                message: `File too large. Max size ${mb} MB`
            });
            return;
        }
        if (this.previewUrl) {
            try { URL.revokeObjectURL(this.previewUrl); } catch { }
        }
        runInAction(() => {
            this.selectedFile = file;
            this.previewUrl = URL.createObjectURL(file);
        });
    }

    clearSelectedFile() {
        if (this.previewUrl) {
            try { URL.revokeObjectURL(this.previewUrl); } catch { }
        }
        runInAction(() => {
            this.selectedFile = null;
            this.previewUrl = null;
        });
    }

    async saveGeneralSettings() {
        const isValida = InputValuesUtil.validateAll([this.orgNameField]);
        if (!isValida) {
            showErrorToast({ message: "Please fix the errors in the form" });
            return;
        }
        try {
            const req = new SaveGeneralSettingsReq({ orgName: this.orgNameField.value });
            runInAction(() => {
                this.saveSettingsState = DataState.loading();
            });
            const res = (await this.layoutStore.orgSettingsService.saveGeneralSettings(req)).getOrError();
            runInAction(() => {
                this.saveSettingsState = DataState.data(res);
                this.layoutStore.orgSettingsState = DataState.data(res);
            });
            showSuccessToast({ message: "Saved successfully" });
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.saveSettingsState = DataState.error(appError);
            });
            showErrorToast({ message: appError.message, description: appError.description });
        }
    }

    async uploadLogo(file?: File) {
        const fileToUpload = file ?? this.selectedFile;
        if (!fileToUpload) {
            showErrorToast({ message: "Please select a file to upload" });
            return;
        }
        try {
            runInAction(() => {
                this.saveLogoSatete = DataState.loading();
            });
            const res = (await this.layoutStore.orgSettingsService.uploadLogo(fileToUpload)).getOrError();
            runInAction(() => {
                this.saveLogoSatete = DataState.data(res);
                this.selectedFile = null;
                if (this.previewUrl) {
                    try { URL.revokeObjectURL(this.previewUrl); } catch { }
                    this.previewUrl = null;
                }
            });
            showSuccessToast({ message: "Logo uploaded successfully" });
            await this.layoutStore.loadGeneralSettings();
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.saveLogoSatete = DataState.error(appError);
            });
            showErrorToast({ message: appError.message, description: appError.description });
        }
    }

    async uploadCroppedFromCanvas(canvas: HTMLCanvasElement) {
        if (!canvas) {
            showErrorToast({ message: "Invalid crop canvas" });
            return;
        }
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!blob) {
            showErrorToast({ message: "Failed to extract image from crop" });
            return;
        }
        const name = this.selectedFile?.name ?? 'logo.png';
        const file = new File([blob], name, { type: blob.type });
        await this.uploadLogo(file);
    }

    async removeLogo() {
        if (!this.orgSettings.logoUrl) {
            showErrorToast({ message: "No logo to remove" });
            return;
        }
        try {
            runInAction(() => {
                this.saveLogoSatete = DataState.loading();
            });
            const res = (await this.layoutStore.orgSettingsService.uploadLogo(null)).getOrError();
            runInAction(() => {
                this.saveLogoSatete = DataState.data(res);
            });
            showSuccessToast({ message: "Logo removed successfully" });
            await this.layoutStore.loadGeneralSettings();
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.saveLogoSatete = DataState.error(appError);
            });
            showErrorToast({ message: appError.message, description: appError.description });
        }
    }
}
