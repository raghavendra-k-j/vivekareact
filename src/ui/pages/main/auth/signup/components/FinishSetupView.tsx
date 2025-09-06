import { Observer } from "mobx-react-lite";
import { Button } from "~/ui/widgets/button/Button";
import { FSelectField } from "~/ui/widgets/form/SelectField";
import { FTextField } from "~/ui/widgets/form/TextField";
import { AuthCard, AuthFooter, AuthFormContainer, AuthHeader } from "../../common/AuthCard";
import { useSignUpPageStore } from "../SignUpPageContext";

export function SignUpFinishSetupView() {
  const store = useSignUpPageStore();

  return (
    <AuthCard>
      <AuthHeader
        title="Set up your organization"
        subtitle="Add a few details to complete your organization setup."
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

        <FSelectField
          required
          label="Organization Type"
          placeholder="Select organization type"
          field={store.orgTypeField}
          options={store.initData.orgTypes.map((e) => ({
            data: e,
            value: () => e.type,
            label: () => e.label,
          }))}
        />

        <Observer>
          {() => {
            if (store.orgTypeField.value === store.initData.otherOrgType) {
              return (
                <FTextField
                  required
                  label="Specify organization type"
                  placeholder="Enter the type of organization"
                  field={store.orgCustomTypeField}
                />
              );
            }
            return null;
          }}
        </Observer>
      </AuthFormContainer>

      <AuthFooter>
        <Observer>
          {() => (
            <Button
              className="w-full"
              color="primary"
              onClick={() => store.finishSetup()}
              loading={store.finishSetupState.isLoading}
            >
              {store.finishSetupState.isLoading ? "Completing setup..." : "Complete setup"}
            </Button>
          )}
        </Observer>
      </AuthFooter>
    </AuthCard>
  );
}
