import { Observer } from "mobx-react-lite";
import { Button } from "~/ui/widgets/button/Button";
import { useDialogManager } from "~/ui/widgets/dialogmanager";
import { FTextField } from "~/ui/widgets/form/TextField";
import { FormAuthCard } from "./FormAuthCard";
import { useFormAuthStore } from "./FormAuthContext";
import { HeaderView } from "./HeaderView";

export function CollectDetailsView() {
    const store = useFormAuthStore();
    const dialogManager = useDialogManager();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        store.onClickNextInCollectDetails(dialogManager);
    }

    return (
        <FormAuthCard>
            <form onSubmit={handleSubmit}>

                <HeaderView
                    title={"Let's get started"}
                    subTitle={"Please fill in your details to begin"}
                />

                <div className="flex flex-col gap-6 px-6 mt-2">
                    <FTextField
                        id="name"
                        label="Full Name"
                        required
                        type="text"
                        placeholder="Enter your full name"
                        field={store.name}
                    />

                    <FTextField
                        id="email"
                        label="Email Address"
                        required
                        type="email"
                        placeholder="Enter your email address"
                        field={store.email}
                    />

                    <FTextField
                        id="mobile"
                        label="Mobile Number"
                        required
                        type="tel"
                        placeholder="Enter your mobile number"
                        field={store.mobile}
                    />
                </div>

                <div className="flex justify-end gap-4 px-6 py-4 mt-6">
                    <Button
                        variant="outline"
                        color="secondary"
                        type="button"
                        onClick={() => store.onClickBackInCollectDetails()}>
                        Back
                    </Button>

                    <Observer>
                        {() => (
                            <Button
                                type="submit"
                                disabled={store.submitState.isLoading}
                                onClick={() => store.onClickNextInCollectDetails(dialogManager)}
                            >
                                Continue
                            </Button>
                        )}
                    </Observer>
                </div>
            </form>
        </FormAuthCard>
    );
}
