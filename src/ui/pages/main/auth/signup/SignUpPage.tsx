import { Observer } from "mobx-react-lite";
import { useRef } from "react";
import { OrgAuthService } from "~/domain/main/auth/services/OrgAuthService";
import { BaseApiClient } from "~/infra/datasources/BaseApiClient";
import { OrgAuthRepo } from "~/infra/repos/OrgAuthRepo";
import { MainAuthAppBar } from "~/ui/components/logo/AuthAppBar";
import { AuthError, AuthLoader } from "../common/AuthCard";
import { SignUpPageContext, useSignUpPageStore } from "./SignUpPageContext";
import { SignUpPageStore } from "./SignUpPageStore";
import { SignUpFinishSetupView } from "./components/FinishSetupView";
import { SignUpInitView } from "./components/InitiateView";
import { SignUpVerifyCodeView } from "./components/VerifyCodeView";
import { ActiveSignUpFragment } from "./models/ActiveFragment";

function SignUpPageProvider({ children }: { children: React.ReactNode }) {
    const store = useRef<SignUpPageStore | null>(
        new SignUpPageStore({
            authService: new OrgAuthService({
                orgAuthRepo: new OrgAuthRepo(BaseApiClient.findInstance()),
            }),
        })
    );
    return (
        <SignUpPageContext.Provider value={store.current}>
            {children}
        </SignUpPageContext.Provider>
    );
}

export default function SignUpPage() {
    return (
        <SignUpPageProvider>
            <SignUpPageInner />
        </SignUpPageProvider>
    );
}

function SignUpPageInner() {
    return (
        <div className="flex flex-col h-full overflow-y-hidden bg-brand-gradient ">
            <MainAuthAppBar />
            <div className="h-full overflow-y-auto">
                <MainAuthContent />
            </div>
        </div>
    );
}



function MainAuthContent() {
    const store = useSignUpPageStore();
    return (
        <Observer>
            {() => {
                return store.initDataState.stateWhen({
                    initOrLoading: () => <AuthLoader />,
                    error: (error) => (<AuthError error={error} onClickRetry={() => store.loadInitData()} />),
                    loaded: () => {
                        switch (store.activeFragment) {
                            case ActiveSignUpFragment.INIT:
                                return <SignUpInitView />;
                            case ActiveSignUpFragment.VERIFY_CODE:
                                return <SignUpVerifyCodeView />;
                            case ActiveSignUpFragment.FINISH_SETUP:
                                return <SignUpFinishSetupView />;
                            default:
                                return null;
                        }
                    },
                });
            }}
        </Observer>
    );
}
