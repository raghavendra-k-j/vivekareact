import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { PasswordOk, validateEmail, validateEmailOtp, validateMobile, validatePassword, validatePersonName } from "~/domain/common/services/commonValidationUtils";
import { validateOrgCustomType, validateOrgName, validateSubdomain } from "~/domain/common/services/OrgDetailsValidator";
import { SignUpFinishSetupReq, SignUpFinishSetupRes } from "~/domain/main/auth/models/FinishSetupModels";
import { PreSignUpData } from "~/domain/main/auth/models/PreSignUpData";
import { SignUpInitReq, SignUpInitRes } from "~/domain/main/auth/models/SignUpInitModels";
import { SignUpSendCodeReq, SignUpSendCodeRes } from "~/domain/main/auth/models/SignUpSendCodeModels";
import { SignUpVerifyCodeReq, SignUpVerifyCodeRes } from "~/domain/main/auth/models/VerifyCodeModels";
import { OrgAuthService } from "~/domain/main/auth/services/OrgAuthService";
import { DataState } from "~/ui/utils/DataState";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { InputValuesUtil } from "~/ui/widgets/form/InputValueUtil";
import { MobileFieldValue } from "~/ui/widgets/form/MobileField";
import { showErrorToast, showSuccessToast } from "~/ui/widgets/toast/toast";
import { ActiveSignUpFragment } from "./models/ActiveFragment";

export class SignUpPageStore {
    authService: OrgAuthService;
    initDataState: DataState<PreSignUpData> = DataState.init();
    activeFragment: ActiveSignUpFragment = ActiveSignUpFragment.INIT;
    nameField = new InputValue<string>("");
    emailField = new InputValue<string>("");
    mobileField = new InputValue<MobileFieldValue>(new MobileFieldValue(null, null));
    otpField = new InputValue<string>("");
    orgNameField = new InputValue<string>("");
    subDomainField = new InputValue<string>("");
    passwordField = new InputValue<string>("");
    passwordOk: PasswordOk = {
        uppercase: false,
        lowercase: false,
        number: false,
        symbol: false,
    };
    confirmPasswordField = new InputValue<string>("");
    orgTypeField = new InputValue<string>("");
    orgCustomTypeField = new InputValue<string>("");
    isPasswordVisible = false;
    requestState: DataState<SignUpInitRes | null> = DataState.init();
    sendCodeState: DataState<SignUpSendCodeRes | null> = DataState.init();
    verifyCodeState: DataState<SignUpVerifyCodeRes | null> = DataState.init();
    finishSetupState: DataState<SignUpFinishSetupRes | null> = DataState.init();

    constructor(props: { authService: OrgAuthService }) {
        this.authService = props.authService;
        makeObservable(this, {
            initDataState: observable.ref,
            activeFragment: observable.ref,
            passwordOk: observable,
            isPasswordVisible: observable,
            requestState: observable.ref,
            sendCodeState: observable.ref,
            verifyCodeState: observable.ref,
            finishSetupState: observable.ref,
        });
        this.loadInitData();
    }

    get isInitFragment() {
        return this.activeFragment === ActiveSignUpFragment.INIT;
    }

    get isFinishSetupFragment() {
        return this.activeFragment === ActiveSignUpFragment.FINISH_SETUP;
    }

    get initData() {
        return this.initDataState.data!;
    }

    get validationData() {
        return this.initData.validationData;
    }

    get requestData() {
        return this.requestState.data!;
    }

    get sendCodeData() {
        return this.sendCodeState.data!;
    }

    togglePasswordVisibility = () => {
        runInAction(() => {
            this.isPasswordVisible = !this.isPasswordVisible;
        });
    };

    async loadInitData() {
        try {
            runInAction(() => {
                this.initDataState = DataState.loading();
            });
            const res = (await this.authService.getPreSignUpData()).getOrError();
            runInAction(() => {
                this.initDataState = DataState.data(res);
                const firstCallingCode = res.callingCodes[0];
                this.mobileField.set(new MobileFieldValue(firstCallingCode.callingCode, null));
            });
            this.addValidations();
        } catch (e) {
            const appError = AppError.fromAny(e);
            runInAction(() => {
                this.initDataState = DataState.error(appError);
            });
        }
    }

    addValidations() {
        // Name Validation
        this.nameField.validator = (value) => {
            return validatePersonName(value, { minLength: this.validationData.personNameMinLength, maxLength: this.validationData.personNameMaxLength });
        };

        // Email Validation
        this.emailField.validator = (value) => {
            return validateEmail(value, { minLength: this.validationData.emailMinLength, maxLength: this.validationData.emailMaxLength });
        };

        // Mobile Validation
        this.mobileField.validator = (value) => {
            const callingCode = this.initData.callingCodes.find(e => e.callingCode === this.mobileField.value?.callingCode) ?? null;
            return validateMobile(value.mobileNumber, { callingCode: callingCode });
        };

        // Password Validation
        this.passwordField.validator = (value) => {
            const result = validatePassword(value, { minLength: this.validationData.passwordMinLength, maxLength: this.validationData.passwordMaxLength });
            runInAction(() => {
                this.passwordOk = result.ok;
            });
            return result.error;
        };

        // Otp Validation
        this.otpField.validator = (value) => {
            return validateEmailOtp(value, { length: this.validationData.otpLength });
        };


        // Organization Name Validation
        this.orgNameField.validator = (value) => {
            return validateOrgName(value, { minLength: this.validationData.orgNameMinLength, maxLength: this.validationData.orgNameMaxLength });
        };

        // Subdomain Validation
        this.subDomainField.validator = (value) => {
            return validateSubdomain(value, { minLength: this.validationData.subdomainMinLength, maxLength: this.validationData.subdomainMaxLength });
        };

        // Organization Type
        this.orgTypeField.validator = (value) => {
            value = value.trim();
            if (!value) {
                return "Please select organization type";
            }
            return null;
        };

        // Custom Organization Type
        this.orgCustomTypeField.validator = (value) => {
            value = value?.trim() ?? "";
            if (this.orgTypeField.value !== this.initData.otherOrgType) {
                return null;
            }
            return validateOrgCustomType(value, { maxLength: this.validationData.customOrgTypeMaxLength, minLength: this.validationData.customOrgTypeMinLength });
        };
    }

    async onClickInitSignUp() {
        const isValid = InputValuesUtil.validateAll([
            this.nameField, this.emailField, this.mobileField, this.passwordField
        ]);
        if (!isValid) {
            showErrorToast({
                message: "Please fix the errors in the form"
            });
            return;
        }
        try {
            runInAction(() => {
                this.requestState = DataState.loading();
            });
            const req = new SignUpInitReq({
                name: this.nameField.value,
                email: this.emailField.value,
                callingCode: this.mobileField.value.callingCode!,
                mobile: this.mobileField.value.mobileNumber!,
                password: this.passwordField.value,
            });
            const res = (await this.authService.signUpInit(req)).getOrError();
            runInAction(() => {
                this.requestState = DataState.data(res);
            });
            const sendCodeRes = await this.sendCode({ isResend: false });
            if (sendCodeRes) {
                runInAction(() => {
                    this.activeFragment = ActiveSignUpFragment.VERIFY_CODE;
                });
            }
        }
        catch (e) {
            console.error("SignUpPageStore.onClickInitSignUp error", e);
            const appError = AppError.fromAny(e);
            runInAction(() => {
                this.requestState = DataState.error(appError);
            });
            showErrorToast({
                message: appError.message,
                description: appError.description
            });
        }
    }

    async sendCode({ isResend }: { isResend: boolean }): Promise<SignUpSendCodeRes | undefined> {
        if (!this.requestState.isData) {
            return;
        }
        try {
            runInAction(() => {
                this.sendCodeState = DataState.loading();
            });
            const req = new SignUpSendCodeReq({
                requestUid: this.requestData.requestUid,
            });
            const res = (await this.authService.signUpSendCode(req)).getOrError();
            runInAction(() => {
                this.sendCodeState = DataState.data(res);
            });
            if (isResend) {
                showSuccessToast({
                    message: "Verification code resent successfully"
                });
            }
            return res;
        }
        catch (e) {
            console.error("SignUpPageStore.sendCode error", e);
            const appError = AppError.fromAny(e);
            runInAction(() => {
                this.sendCodeState = DataState.error(appError);
            });
            showErrorToast({
                message: appError.message,
                description: appError.description
            });
        }
    }

    async verifyCode() {
        if (!this.sendCodeState.isData) {
            return;
        }
        if (!this.otpField.validate()) {
            showErrorToast({
                message: "Please enter a valid OTP",
            });
            return;
        }
        try {
            runInAction(() => {
                this.verifyCodeState = DataState.loading();
            });
            const req = new SignUpVerifyCodeReq({
                requestUid: this.requestData.requestUid,
                otpId: this.sendCodeData.otpId,
                otp: this.otpField.value,
            });
            const res = (await this.authService.signUpVerifyCode(req)).getOrError();
            runInAction(() => {
                this.verifyCodeState = DataState.data(res);
                this.activeFragment = ActiveSignUpFragment.FINISH_SETUP;
            });
        }
        catch (e) {
            console.error("SignUpPageStore.verifyCode error", e);
            const appError = AppError.fromAny(e);
            runInAction(() => {
                this.verifyCodeState = DataState.error(appError);
            });
            showErrorToast({
                message: appError.message,
                description: appError.description
            });
        }
    }


    onClickChangeEmail() {
        runInAction(() => {
            this.activeFragment = ActiveSignUpFragment.INIT;
            this.requestState = DataState.init();
            this.otpField.clearField("");
        });
    }

    async finishSetup() {
        const isValid = InputValuesUtil.validateAll([
            this.orgNameField, this.subDomainField, this.orgTypeField, this.orgCustomTypeField
        ]);
        if (!isValid) {
            showErrorToast({
                message: "Please fix the errors in the form"
            });
            return;
        }
        try {
            runInAction(() => {
                this.finishSetupState = DataState.loading();
            });
            const req = new SignUpFinishSetupReq({
                requestUid: this.requestData.requestUid,
                orgName: this.orgNameField.value,
                subdomain: this.subDomainField.value,
                orgType: this.orgTypeField.value,
                orgTypeCustom: this.orgCustomTypeField.value,
            });
            const res = (await this.authService.signUpFinishSetup(req)).getOrError();
            showSuccessToast({
                message: "Organization setup completed successfully. Redirecting..."
            });
            window.location.assign(res.redirectUrl);
            runInAction(() => {
                this.finishSetupState = DataState.data(res);
            });
        }
        catch (e) {
            console.error("SignUpPageStore.finishSetup error", e);
            const appError = AppError.fromAny(e);
            runInAction(() => {
                this.finishSetupState = DataState.error(appError);
            });
            showErrorToast({
                message: appError.message,
                description: appError.description
            });
        }
    }

}