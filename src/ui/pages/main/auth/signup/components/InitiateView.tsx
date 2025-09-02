

import { useState } from "react";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { CardHeader } from "~/ui/components/card";
import { Button } from "~/ui/widgets/button/Button";
import { FTextField } from "~/ui/widgets/form/TextField";
import { AuthCard, AuthCardFooter, AuthFormContainer, AuthHeader } from "../../common/AuthCard";
import { useSignUpPageStore } from "../SignUpPageContext";


export function SignUpInitView() {
    const store = useSignUpPageStore();
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState("");
    // Use a local FValue for OTP input
    const [otpField] = useState(() => new InputValue<string>(""));

    // Dummy send OTP handler (replace with real API call)
    const handleSendOtp = async () => {
        setLoading(true);
        setTimeout(() => {
            setOtpSent(true);
            setInfo(`We sent a 6-digit code to ${store.emailField.value}. Use 123456 in this demo.`);
            setLoading(false);
        }, 800);
    };

    // Dummy verify OTP handler (replace with real API call)
    const handleVerifyOtp = async () => {
        setLoading(true);
        setTimeout(() => {
            if (otpField.value === "123456") {
                otpField.error = "";
                store.gotoFinishSetup();
            } else {
                otpField.error = "Invalid OTP";
            }
            setLoading(false);
        }, 800);
    };

    return (
        <AuthCard>
            <CardHeader>
                <AuthHeader
                    title="Sign Up"
                    subtitle="Create your account to get started"
                />
                <AuthFormContainer className="flex flex-col gap-8">
                    <div className="flex flex-col gap-6">
                        <FTextField
                            required
                            label="Name"
                            placeholder="Enter your name"
                            field={store.nameField}
                        />
                        <FTextField
                            required
                            label="Password"
                            placeholder="Enter your password"
                            field={store.nameField}
                        />
                        <FTextField
                            required
                            label="Email"
                            placeholder="Enter your email"
                            field={store.emailField}
                        />
                        <FTextField
                            required
                            label="Mobile Number"
                            placeholder="Enter your mobile number"
                            field={store.mobileField}
                        />
                    </div>
                    {!otpSent ? (
                        <AuthCardFooter>
                            <Button
                                onClick={handleSendOtp}
                                className="rounded-md"
                                color="primary"
                            >
                                {loading ? "Sending..." : "Send Verification Code"}
                            </Button>
                        </AuthCardFooter>
                    ) : (
                        <div className="flex flex-col gap-4 mt-4">
                            {info && <div className="text-blue-700 text-sm">{info}</div>}
                            <FTextField
                                required
                                label="Enter OTP"
                                placeholder="6-digit code"
                                field={otpField}
                                maxLength={6}
                            />
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleVerifyOtp}
                                    color="primary"
                                >
                                    {loading ? "Verifying..." : "Verify & Continue"}
                                </Button>
                                <Button
                                    onClick={handleSendOtp}
                                    variant="outline"
                                    color="secondary"
                                    disabled={loading}
                                >
                                    Resend OTP
                                </Button>
                            </div>
                        </div>
                    )}
                </AuthFormContainer>
            </CardHeader>
        </AuthCard>
    );
}