import { Button } from "~/ui/widgets/button/Button";
import { FTextField } from "~/ui/widgets/form/TextField";
import { AuthCard, AuthFooter, AuthFormContainer, AuthHeader } from "../../common/AuthCard";
import { useSignUpPageStore } from "../SignUpPageContext";

export function SignUpFinishSetupView() {
    const store = useSignUpPageStore();
    return (
        <AuthCard>
            <AuthHeader
                title="Set up your organization"
                subtitle="Enter your organization name and choose a unique website address for your organization."
            />
            <AuthFormContainer className="flex flex-col gap-8">
                <FTextField
                    required
                    label="Organization Name"
                    placeholder="Enter organization name"
                    field={store.orgNameField}
                />
                <FTextField
                    required
                    label="Website Address"
                    placeholder="Enter website address"
                    field={store.subDomainField}
                />
            </AuthFormContainer>
            <AuthFooter>
                <Button className="w-full" color="primary" onClick={() => store.onClickFinishSetup()}>
                    Finish Setup
                </Button>
            </AuthFooter>
        </AuthCard>
    );
}
