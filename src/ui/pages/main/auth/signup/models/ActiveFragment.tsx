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
    static ORG_DETAILS = new ActiveSignUpFragment('orgDetails');
    static FINISH_SETUP = new ActiveSignUpFragment('finishSetup');
}
