import { Button } from "~/ui/widgets/button/Button";
import { FTextField } from "~/ui/widgets/form/TextField";
import { AuthCard, AuthFooter, AuthFormContainer, AuthHeader } from "../../common/AuthCard";
import { useSignUpPageStore } from "../SignUpPageContext";
import { Observer } from "mobx-react-lite";

export function SignUpVerifyCodeView() {
    const store = useSignUpPageStore();

    return (
        <AuthCard>
            <AuthHeader
                title="Verify Email"
                subtitle={
                    <>
                        Enter the {store.validationData.otpLength}-digit verification code sent to{" "}
                        <span className="font-medium">{store.emailField.value}</span>
                    </>
                }
            />

            <AuthFormContainer className="flex flex-col gap-3">
                <FTextField
                    required
                    label="Verification code"
                    placeholder="Enter verification code"
                    field={store.otpField}
                />

                <Observer>
                    {() => (
                        <div className="flex flex-col gap-2">
                            <InlineHelpRow
                                text="Haven’t received the code?"
                                actionLabel={store.sendCodeState.isLoading ? "Resending…" : "Resend"}
                                onAction={() => store.sendCode({ isResend: true })}
                                disabled={store.sendCodeState.isLoading}
                            />
                            <InlineHelpRow
                                text="Entered incorrect email?"
                                actionLabel="Change email"
                                onAction={() => store.onClickChangeEmail()}
                            />
                        </div>
                    )}
                </Observer>
            </AuthFormContainer>

            <AuthFooter>
                <Button className="w-full" onClick={() => store.verifyCode()} loading={store.verifyCodeState.isLoading}>
                    Verify
                </Button>
            </AuthFooter>
        </AuthCard>
    );
}

function LinkButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type="button"
            className={`text-primary underline hover:opacity-80 disabled:opacity-50 ${className ?? ""}`}
            {...props}
        >
            {children}
        </button>
    );
}

function InlineHelpRow({
    text,
    actionLabel,
    onAction,
    disabled,
}: {
    text: string;
    actionLabel: string;
    onAction: () => void;
    disabled?: boolean;
}) {
    return (
        <p className="text-secondary">
            {text}{" "}
            <LinkButton onClick={onAction} disabled={disabled}>
                {actionLabel}
            </LinkButton>
        </p>
    );
}
