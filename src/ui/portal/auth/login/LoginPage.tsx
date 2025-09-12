import { ArrowRight } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { useRef } from "react";
import { AuthCard, AuthFooter, AuthFormContainer, AuthHeader } from "~/ui/components/auth/AuthCard";
import { Button } from "~/ui/widgets/button/Button";
import { Checkbox } from "~/ui/widgets/form/Checkbox";
import { PasswordField } from "~/ui/widgets/form/PasswordField";
import { FTextField } from "~/ui/widgets/form/TextField";
import { useAppStore } from "../../layout/app/AppContext";
import { getAuthService } from "../../layout/bootApp";
import { useRootLayoutStore } from "../../layout/root/RootLayoutContext";
import AuthLayout from "../layout/AuthLayout";
import { LoginPageContext, useLoginPageStore } from "./LoginPageContext";
import { LoginPageStore } from "./LoginPageStore";


function LoginPageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<LoginPageStore | null>(null);
    const appStore = useAppStore();
    const rootLayout = useRootLayoutStore();
    if (appStore.hasLoggedInUser) {
        rootLayout.navigateToPortal({ appStore: appStore });
        return;
    }
    if (storeRef.current === null) {
        storeRef.current = new LoginPageStore({
            authService: getAuthService(),
            appStore: appStore,
            rootLayoutStore: rootLayout,
        });
    }
    return <LoginPageContext.Provider value={storeRef.current}>
        {children}
    </LoginPageContext.Provider>
}


export default function LoginPage() {
    return (
        <LoginPageProvider>
            <LoginPageInner />
        </LoginPageProvider>
    );
}


function LoginPageInner() {
    const store = useLoginPageStore();
    return (
        <AuthLayout>
            <AuthCard>
                <AuthHeader
                    title="Login"
                    subtitle="Please enter your details to login"
                />
                <AuthFormContainer className="flex flex-col gap-6">
                    <div className="flex flex-col gap-6">
                        <FTextField
                            required
                            label="Email"
                            placeholder="Enter your email address"
                            field={store.identifierField}
                        />
                        <Observer>{() => (<PasswordField
                            field={store.passwordField}
                            placeholder="Enter your password"
                            passwordVisible={store.showPassword}
                            onClickEye={() => store.toggleShowPassword()}
                        />)}</Observer>
                        <RememberMe />
                    </div>
                    <Observer>
                        {() => (<Button
                            className="w-full"
                            loading={store.loginState.isLoading}
                            onClick={() => store.onClickLogin()}
                        >
                            Login
                            <ArrowRight className="ms-2" size={16} />
                        </Button>)}
                    </Observer>
                </AuthFormContainer>
                <AuthFooter>
                    <div className="flex flex-col w-full items-center">
                        <span className="mb-2 text-sm text-muted-foreground">Don't have an account?</span>
                        <Button color="success" className="w-full">Create Account</Button>
                    </div>
                </AuthFooter>
            </AuthCard>
        </AuthLayout>
    );
}


function RememberMe() {
    const store = useLoginPageStore();
    return (
        <Observer>{() => (<Checkbox
            id="rememberMe"
            label="Remember me"
            value={store.rememberMe}
            onChange={(val) => store.setRememberMe(val)}
        />)}</Observer>
    );
}