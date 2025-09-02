import { InputValue } from "~/ui/widgets/form/InputValue";
import { ActiveSignUpFragment } from "./models/ActiveFragment";
import { makeObservable, observable, runInAction } from "mobx";


export class SignUpPageStore {

    activeFragment: ActiveSignUpFragment = ActiveSignUpFragment.INIT;
    nameField = new InputValue<string>("");
    emailField = new InputValue<string>("");
    mobileField = new InputValue<string>("");
    otpField = new InputValue<string>("");
    orgNameField = new InputValue<string>("");
    subDomainField = new InputValue<string>("");
    passwordField = new InputValue<string>("");
    confirmPasswordField = new InputValue<string>("");
    isPasswordVisible = false;

    constructor() {
        makeObservable(this, {
            activeFragment: observable.ref,
            isPasswordVisible: observable,
        });
    }

    get isInitFragment() {
        return this.activeFragment === ActiveSignUpFragment.INIT;
    }

    get isOrgDetailsFragment() {
        return this.activeFragment === ActiveSignUpFragment.ORG_DETAILS;
    }

    get isFinishSetupFragment() {
        return this.activeFragment === ActiveSignUpFragment.FINISH_SETUP;
    }

    generatePassword() {

    }


    // Stepper navigation for: INIT (Contact Info & OTP) → FINISH_SETUP (Password) → ORG_DETAILS (Organization)
    nextStep() {
        runInAction(() => {
            if (this.activeFragment === ActiveSignUpFragment.INIT) {
                this.activeFragment = ActiveSignUpFragment.FINISH_SETUP;
            } else if (this.activeFragment === ActiveSignUpFragment.FINISH_SETUP) {
                this.activeFragment = ActiveSignUpFragment.ORG_DETAILS;
            }
        });
    }

    prevStep() {
        runInAction(() => {
            if (this.activeFragment === ActiveSignUpFragment.ORG_DETAILS) {
                this.activeFragment = ActiveSignUpFragment.FINISH_SETUP;
            } else if (this.activeFragment === ActiveSignUpFragment.FINISH_SETUP) {
                this.activeFragment = ActiveSignUpFragment.INIT;
            }
        });
    }

    // For compatibility with previous code
    gotoFinishSetup() {
        runInAction(() => {
            this.activeFragment = ActiveSignUpFragment.FINISH_SETUP;
        });
    }


}