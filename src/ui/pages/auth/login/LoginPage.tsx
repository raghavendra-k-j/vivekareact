import { ArrowRight } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { useRef } from "react";
import { Link } from "react-router";
import { AuthCard, AuthFooter, AuthFormContainer, AuthHeader } from "~/ui/components/auth/AuthCard";
import { Button } from "~/ui/widgets/button/Button";
import { Checkbox } from "~/ui/widgets/form/Checkbox";
import { FTextField } from "~/ui/widgets/form/TextField";
import AuthLayout from "../AuthLayout";
import { LoginPageContext, useLoginPageStore } from "./LoginPageContext";
import { LoginPageStore } from "./LoginPageStore";


function LoginPageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<LoginPageStore | null>(null);
    if (storeRef.current === null) {
        storeRef.current = new LoginPageStore();
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


function PasswordField() {
    const store = useLoginPageStore();
    return (
        <Observer>{() => (
            <div>
                <FTextField
                    required
                    label="Password"
                    placeholder="Enter your password"
                    type={store.showPassword ? "text" : "password"}
                    field={store.passwordField}
                />
                <div className="flex justify-between mt-2">
                    <button
                        type="button"
                        className="text-secondary text-sm font-bold bg-transparent border-none p-0 cursor-pointer"
                        onClick={() => store.toggleShowPassword()}
                    >
                        {store.showPassword ? "Hide Password" : "Show Password"}
                    </button>
                    <Link to="/forgot-password" className="text-primary text-sm hover:underline focus:underline font-bold">Forgot Password?</Link>
                </div>
            </div>
        )}</Observer>
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
                        <PasswordField />
                        <RememberMe />
                    </div>
                    <Button className="w-full">
                        Login
                        <ArrowRight className="ms-2" size={16} />
                    </Button>
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