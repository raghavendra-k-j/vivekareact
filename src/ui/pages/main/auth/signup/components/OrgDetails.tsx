import { CardHeader } from "~/ui/components/card";
import { Button } from "~/ui/widgets/button/Button";
import { FTextField } from "~/ui/widgets/form/TextField";
import { AuthCard, AuthCardFooter, AuthFormContainer, AuthHeader } from "../../common/AuthCard";
import { useSignUpPageStore } from "../SignUpPageContext";

export function SignUpOrgDetailsView() {
    const store = useSignUpPageStore();
    return (
        <AuthCard>
            <CardHeader>
                <AuthHeader
                    title="Set up your organization"
                    subtitle="Enter your organization name and choose a unique website address for your organization."
                />
                <AuthFormContainer className="flex flex-col gap-8">
                    <div className="flex flex-col gap-6">
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
                    </div>
                    <AuthCardFooter>
                        <Button color="primary" onClick={() => {/* Finalize sign-up here */}}>
                            Finish
                        </Button>
                    </AuthCardFooter>
                </AuthFormContainer>
            </CardHeader>
        </AuthCard>
    );
}
