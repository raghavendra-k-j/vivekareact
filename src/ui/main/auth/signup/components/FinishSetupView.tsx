import { Observer } from "mobx-react-lite";
import { BaseEnv } from "~/core/config/BaseEnv";
import { AuthCard, AuthFooter, AuthFormContainer, AuthHeader } from "~/ui/components/auth/AuthCard";
import { Button } from "~/ui/widgets/button/Button";
import { InputError } from "~/ui/widgets/form/InputError";
import { InputGroup } from "~/ui/widgets/form/InputGroup";
import { InputLabel } from "~/ui/widgets/form/InputLabel";
import { ReqMark } from "~/ui/widgets/form/ReqMark";
import { FSelectField } from "~/ui/widgets/form/SelectField";
import { FTextField } from "~/ui/widgets/form/TextField";
import { useSignUpPageStore } from "../SignUpPageContext";



const sanitizeLabel = (s: string) => {
  let out = s.toLowerCase().replace(/[^a-z0-9-]/g, "");
  out = out.replace(/-+/g, "-");
  out = out.replace(/^-+/, "").replace(/-+$/, "");
  return out.slice(0, 63);
};

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
              return (
                <>
                  <InputGroup className="mt-1 w-full">
                    <InputGroup.Addon>https://</InputGroup.Addon>
                    <InputGroup.Input
                      className="flex-1 min-w-0"
                      value={store.subDomainField.value}
                      placeholder="your-organization-name"
                      onChange={(e) => {
                        if ((e.nativeEvent as InputEvent).isComposing) return;
                        store.subDomainField.set(sanitizeLabel(e.target.value));
                      }}
                      onBeforeInput={(e) => {
                        const data = (e as any).data as string | null;
                        if (!data) return;
                        if (/[^a-zA-Z0-9-]/.test(data)) e.preventDefault();
                      }}
                      onPaste={(e) => {
                        const text = e.clipboardData.getData("text") || "";
                        e.preventDefault();
                        store.subDomainField.set(sanitizeLabel(text));
                      }}
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      maxLength={63}
                      pattern="^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$"
                      title="Use lowercase letters, digits, and hyphens. Can't start or end with a hyphen. Max 63 characters."
                    />
                    <InputGroup.Addon>.{BaseEnv.instance.rootDomain}</InputGroup.Addon>
                  </InputGroup>
                  {store.subDomainField.error && (<InputError>{store.subDomainField.error}</InputError>)}
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
