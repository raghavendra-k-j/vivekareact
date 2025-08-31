import FilledButton from "~/ui/widgets/button/FilledButton";
import { useFormAuthStore } from "./FormAuthContext";
import OutlinedButton from "~/ui/widgets/button/OutlinedButton";
import { FormAuthCard } from "./FormAuthCard";
import { FTextField } from "~/ui/widgets/form/input/FTextField";
import { HeaderView } from "./HeaderView";
import { Observer } from "mobx-react-lite";
import { useDialogManager } from "~/ui/widgets/dialogmanager";
import { TimeFmt } from "~/core/utils/TimeFmt";
import { EmailOTPConst } from "~/core/const/EmailOTPConst";

export function VerifyEmailView() {
    const store = useFormAuthStore();
    const dialogManager = useDialogManager();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        store.onClickVerifyOTP(dialogManager);
    };

    return (
        <FormAuthCard>
            <form onSubmit={handleSubmit}>
                <HeaderView
                    title="Check your email"
                    subTitle={
                        <>
                            An OTP has been sent to{" "}
                            <span className="font-semibold">{store.email.value}</span>. Please enter it below to verify.
                        </>
                    }
                />

                <div className="flex flex-col gap-6 px-6">
                    <FTextField
                        id="otp"
                        label="Verification Code"
                        required
                        type="text"
                        placeholder={`Enter the ${EmailOTPConst.otpLen}-digit code`}
                        field={store.otp}
                    />

                    <div className="text-sm text-default">
                        Didn’t get the code?&nbsp;&nbsp;
                        <Observer>
                            {() =>
                                store.resendCountdown > 0 ? (
                                    <span className="text-primary font-semibold cursor-not-allowed">
                                        Resend ({TimeFmt.format(store.resendCountdown)})
                                    </span>
                                ) : (
                                    <span
                                        className="text-primary cursor-pointer font-semibold"
                                        onClick={() => store.onClickResendOTP(dialogManager)}
                                    >
                                        Resend it
                                    </span>
                                )
                            }
                        </Observer>
                    </div>
                </div>

                <div className="px-6 py-4 mt-4 gap-4 flex justify-end">
                    <OutlinedButton type="button" onClick={() => store.onClickBackInVerifyEmail()}>
                        Back
                    </OutlinedButton>

                    <Observer>
                        {() => (
                            <FilledButton
                                disabled={store.verifyState.isLoading}
                                type="submit"
                            >
                                Verify Email
                            </FilledButton>
                        )}
                    </Observer>
                </div>
            </form>
        </FormAuthCard>
    );
}
