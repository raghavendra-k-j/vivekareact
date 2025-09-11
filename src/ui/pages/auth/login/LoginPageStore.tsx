import { action, makeObservable, observable } from "mobx";
import { InputValue } from "~/ui/widgets/form/InputValue";

export class LoginPageStore {

    identifierField: InputValue<string> = new InputValue("");
    passwordField: InputValue<string> = new InputValue("");
    showPassword: boolean = false;
    rememberMe: boolean = false;

    constructor() {
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




}