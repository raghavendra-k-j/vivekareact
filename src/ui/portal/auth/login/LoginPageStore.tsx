import { action, makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { LoginRes } from "~/domain/auth/models/LoginRes";
import { AuthService } from "~/domain/auth/services/AuthService";
import { navigateToPortal } from "~/ui/utils/authRedirectUtils";
import { DataState } from "~/ui/utils/DataState";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { InputValuesUtil } from "~/ui/widgets/form/InputValueUtil";
import { showErrorToast, showSuccessToast } from "~/ui/widgets/toast/toast";
import { AppStore } from "../../layout/app/AppStore";

export class LoginPageStore {

    identifierField: InputValue<string> = new InputValue("");
    passwordField: InputValue<string> = new InputValue("");
    showPassword: boolean = false;
    rememberMe: boolean = false;
    loginState: DataState<LoginRes> = DataState.init();
    authService: AuthService;
    appStore: AppStore;

    constructor({ authService, appStore }: { authService: AuthService, appStore: AppStore }) {
        this.authService = authService;
        this.appStore = appStore;
        makeObservable(this, {
            identifierField: observable.ref,
            passwordField: observable.ref,
            showPassword: observable,
            rememberMe: observable,
            setRememberMe: action,
            toggleShowPassword: action,
        });
    }

    toggleShowPassword = () => {
        this.showPassword = !this.showPassword;
    }

    setRememberMe = (value: boolean) => {
        this.rememberMe = value;
    }

    async onClickLogin() {
        const isValid = InputValuesUtil.validateAll([this.identifierField, this.passwordField]);
        if (isValid === false) {
            return;
        }
        try {
            runInAction(() => {
                this.loginState = DataState.init();
            });
            let identifier = this.identifierField.value.trim();
            const password = this.passwordField.value.trim();
            this.loginState = DataState.loading();
            const res = (await this.authService.login({ identifier, password })).getOrError();
            await this.authService.saveTokenLocally({
                accessToken: res.authToken.accessToken,
                appUserType: res.baseAuthRes.user.appUserType
            });
            await this.appStore.updateAuthResponse({
                baseAuthRes: res.baseAuthRes,
                authToken: res.authToken,
            });
            runInAction(() => {
                this.loginState = DataState.data(res);
            });
            showSuccessToast({ message: "Login successful" });
            navigateToPortal({ appStore: this.appStore });
        }
        catch (e) {
            const appError = AppError.fromAny(e);
            runInAction(() => {
                this.loginState = DataState.error(appError);
            });
            showErrorToast({
                message: appError.message,
                description: appError.description,
            });
        }
    }
}