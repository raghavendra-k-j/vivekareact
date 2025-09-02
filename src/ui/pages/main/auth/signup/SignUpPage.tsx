import { useRef } from "react";
import { SignUpPageContext, useSignUpPageStore } from "./SignUpPageContext";
import { SignUpPageStore } from "./SignUpPageStore";
import { SignUpInitView } from "./components/InitiateView";
import { MainAuthAppBar } from "~/ui/components/logo/AuthAppBar";
import { Observer } from "mobx-react-lite";
import { ActiveSignUpFragment } from "./models/ActiveFragment";
import { SignUpOrgDetailsView } from "./components/OrgDetails";
import { SignUpFinishSetupView } from "./components/FinishSetupView";


function SignUpPageProvider({ children }: { children: React.ReactNode }) {
    const store = useRef<SignUpPageStore | null>(new SignUpPageStore());
    return (<SignUpPageContext.Provider value={store.current}>
        {children}
    </SignUpPageContext.Provider>);
}


export default function SignUpPage() {
    return (<SignUpPageProvider>
        <SignUpPageInner />
    </SignUpPageProvider>);
}

function SignUpPageInner() {
    return (<div>
        <MainAuthAppBar />
        <MainContent />
    </div>);
}

function MainContent() {
    const store = useSignUpPageStore();
    return (<Observer>
        {() => {
            switch (store.activeFragment) {
                case ActiveSignUpFragment.INIT:
                    return <SignUpInitView />;
                case ActiveSignUpFragment.ORG_DETAILS:
                    return <SignUpOrgDetailsView />;
                case ActiveSignUpFragment.FINISH_SETUP:
                    return <SignUpFinishSetupView />;
                default:
                    return null;
            }
        }}
    </Observer>);

}