
import { CardHeader } from "~/ui/components/card";
import { Button } from "~/ui/widgets/button/Button";
import { FTextField } from "~/ui/widgets/form/TextField";
import { AuthCard, AuthCardFooter, AuthFormContainer, AuthHeader } from "../../common/AuthCard";
import { useSignUpPageStore } from "../SignUpPageContext";
import { SignUpOrgDetailsView } from "./OrgDetails";
import { useState } from "react";

// Stepper UI for Password and Organization steps
const steps = ["Password", "Organization"];

export function SignUpFinishSetupView() {
    const store = useSignUpPageStore();
    // Step: 0 = Password, 1 = Organization
    const [step, setStep] = useState(0);

    // Password strength logic (reuse from previous code)
    const checks = store.validatePassword?.(store.passwordField.value) ?? {
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false,
    };
    const satisfiedCount =
        (checks.length ? 1 : 0) +
        (checks.upper ? 1 : 0) +
        (checks.lower ? 1 : 0) +
        (checks.number ? 1 : 0) +
        (checks.special ? 1 : 0);
    const strengthPct = (satisfiedCount / 5) * 100;

    // Navigation
    const handleNext = () => {
        if (step === 0) setStep(1);
        else store.nextStep(); // finish
    };
    const handleBack = () => {
        if (step === 1) setStep(0);
        else store.prevStep();
    };

    return (
        <AuthCard>
            <CardHeader>
                <div className="mb-4">
                    <ol className="flex items-center gap-2 text-sm">
                        {steps.map((label, i) => (
                            <li key={label} className="flex items-center gap-2">
                                <div className={`size-6 rounded-full flex items-center justify-center border ${i < step ? "bg-green-600 text-white border-green-600" : i === step ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-300"}`}>{i < step ? "✓" : i + 1}</div>
                                <span className={i === step ? "font-semibold text-gray-900" : "text-gray-500"}>{label}</span>
                                {i < steps.length - 1 && <span className="mx-2 text-gray-300">—</span>}
                            </li>
                        ))}
                    </ol>
                </div>
                {step === 0 && (
                    <AuthHeader
                        title="Set your password"
                        subtitle="Create a new password to secure your account"
                    />
                )}
                {step === 1 && (
                    <AuthHeader
                        title="Set up your organization"
                        subtitle="Enter your organization name and website address."
                    />
                )}
                <AuthFormContainer className="flex flex-col gap-8">
                    {step === 0 && (
                        <div className="flex flex-col gap-6">
                            {/* Password field */}
                            <div className="flex flex-col gap-2">
                                <FTextField
                                    required
                                    label="Password"
                                    placeholder="Enter password"
                                    type={store.isPasswordVisible ? "text" : "password"}
                                    field={store.passwordField}
                                />
                                <div className="flex items-center justify-between text-sm">
                                    <button
                                        type="button"
                                        className="text-blue-700 hover:underline"
                                        onClick={() => (store.isPasswordVisible = !store.isPasswordVisible)}
                                    >
                                        {store.isPasswordVisible ? "Hide password" : "Show password"}
                                    </button>
                                    <button
                                        type="button"
                                        className="text-blue-700 hover:underline"
                                        onClick={() => store.generatePassword?.()}
                                    >
                                        Generate strong password
                                    </button>
                                </div>
                            </div>
                            {/* Strength bar */}
                            <div className="flex flex-col gap-2">
                                <div className="h-2 w-full rounded-full bg-gray-200">
                                    <div
                                        className="h-2 rounded-full transition-all"
                                        style={{
                                            width: `${strengthPct}%`,
                                            background:
                                                satisfiedCount <= 2
                                                    ? "#ef4444"
                                                    : satisfiedCount === 3
                                                        ? "#eab308"
                                                        : "#16a34a",
                                        }}
                                    />
                                </div>
                                <span className="text-xs text-gray-500">
                                    Use at least 8 characters. Mixing uppercase, lowercase, numbers, and symbols makes it stronger.
                                </span>
                            </div>
                            {/* Checklist */}
                            <ul className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
                                <CheckItem ok={checks.length} label="At least 8 characters" />
                                <CheckItem ok={checks.upper} label="Contains an uppercase letter" />
                                <CheckItem ok={checks.lower} label="Contains a lowercase letter" />
                                <CheckItem ok={checks.number} label="Contains a number" />
                                <CheckItem ok={checks.special} label="Contains a symbol" />
                            </ul>
                            {/* Confirm field */}
                            <FTextField
                                required
                                label="Confirm password"
                                placeholder="Re-enter password"
                                type={store.isPasswordVisible ? "text" : "password"}
                                field={store.confirmPasswordField}
                            />
                        </div>
                    )}
                    {step === 1 && (
                        <SignUpOrgDetailsView />
                    )}
                    <AuthCardFooter>
                        {step > 0 && (
                            <Button variant="outline" color="secondary" onClick={handleBack}>
                                Back
                            </Button>
                        )}
                        <Button className="rounded-md" color="primary" onClick={handleNext}>
                            {step === 0 ? "Next" : "Finish"}
                        </Button>
                    </AuthCardFooter>
                </AuthFormContainer>
            </CardHeader>
        </AuthCard>
    );
}

function CheckItem({ ok, label }: { ok: boolean; label: string }) {
    return (
        <li className="flex items-center gap-2">
            <span
                className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${ok
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                    }`}
            >
                {ok ? "✓" : ""}
            </span>
            <span className={ok ? "text-gray-900" : "text-gray-500"}>{label}</span>
        </li>
    );
}
