import { Observer } from "mobx-react-lite";
import { Button } from "~/ui/widgets/button/Button";
import { MobileField } from "~/ui/widgets/form/MobileField";
import { PasswordField } from "~/ui/widgets/form/PasswordField";
import { PasswordOkView } from "~/ui/widgets/form/PasswordOkView";
import { FTextField } from "~/ui/widgets/form/TextField";
import { AuthCard, AuthFooter, AuthFormContainer, AuthHeader } from "../../common/AuthCard";
import { useSignUpPageStore } from "../SignUpPageContext";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";

export function SignUpInitView() {
    const store = useSignUpPageStore();
    return (
        <AuthCard>
            <AuthHeader
                title="Create your organization"
                subtitle="Please enter your details to continue"
            />
            <AuthFormContainer className="flex flex-col gap-3">
                <FTextField
                    required
                    label="Full name"
                    placeholder="Enter your full name"
                    field={store.nameField}
                />
                <FTextField
                    required
                    label="Email"
                    placeholder="Enter your email address"
                    field={store.emailField}
                />
                <MobileField
                    required
                    label="Mobile Number"
                    placeholder="Enter your mobile number"
                    callingCodes={store.initData.callingCodes.map(e => ({
                        code: e.callingCode,
                        label: e.callingCode
                    }))}
                    field={store.mobileField}
                />
                <div className="flex flex-col gap-2">
                    <Observer>
                        {() => <>
                            <PasswordField
                                required
                                label="Password"
                                placeholder="Create a password"
                                field={store.passwordField}
                                passwordVisible={store.isPasswordVisible}
                                onClickEye={store.togglePasswordVisibility}
                            />
                            <PasswordOkView passwordOk={store.passwordOk} />
                        </>}
                    </Observer>


                </div>
            </AuthFormContainer>
            <AuthFooter>
                <Observer>
                    {() => (<Button loading={store.requestState.isLoading} className="w-full" onClick={() => store.onClickInitSignUp()}>
                        Start Setup
                        <ArrowRightIcon className="ml-2 w-4 h-4" />
                    </Button>)}
                </Observer>
                <p className="mt-3 text-xs text-gray-500 text-center">
                    By clicking Sign Up, you agree to our{" "}
                    <Link to="/terms">
                        <span className="underline">Terms &amp; Conditions</span>
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy">
                        <span className="underline">Privacy Policy</span>.
                    </Link>
                </p>
            </AuthFooter>
        </AuthCard>
    );
}
