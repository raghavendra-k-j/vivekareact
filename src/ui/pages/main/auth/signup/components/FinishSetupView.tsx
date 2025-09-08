import { Observer } from "mobx-react-lite";
import { Button } from "~/ui/widgets/button/Button";
import { FSelectField } from "~/ui/widgets/form/SelectField";
import { FTextField } from "~/ui/widgets/form/TextField";
import { AuthCard, AuthFooter, AuthFormContainer, AuthHeader } from "../../common/AuthCard";
import { useSignUpPageStore } from "../SignUpPageContext";
import { BaseEnv } from "~/core/config/BaseEnv";
import { Input } from "~/ui/widgets/form/Input";
import { InputLabel } from "~/ui/widgets/form/InputLabel";
import { ReqMark } from "~/ui/widgets/form/ReqMark";
import { InputError } from "~/ui/widgets/form/InputError";

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

        <div>
          <InputLabel>
            Organization Link <ReqMark />
          </InputLabel>

          <Observer>
            {() => {
              const root = BaseEnv.instance.rootDomain;
              return (
                <>
                  <div className="my-1 flex flex-row border border-default rounded-sm items-center shadow-xs focus-within:ring-[1.5px] focus-within:ring-primary focus-within:border-primary overflow-hidden">
                    <div className="ps-2">https://</div>
                    <Input
                      value={store.subDomainField.value}
                      onChange={(e) => store.subDomainField.set(e.target.value)}
                      style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        boxShadow: "none",
                        border: "none",
                        flex: 1,
                      }}
                      placeholder="your-organization-name"
                    />
                    <div className="pe-2">.{root}</div>
                  </div>
                  <InputError>{store.subDomainField.error}</InputError>
                </>
              );
            }}
          </Observer>
        </div>



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
