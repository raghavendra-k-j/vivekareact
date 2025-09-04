export type ActiveSignUpFragmentProps = {
    id: string;
    label: string;
};

export class ActiveSignUpFragment {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    static INIT = new ActiveSignUpFragment('init');
    static VERIFY_CODE = new ActiveSignUpFragment('verifyCode');
    static FINISH_SETUP = new ActiveSignUpFragment('finishSetup');
}
