import { Observer } from "mobx-react-lite";
import { ReactNode, useRef } from "react";
import { DateFmt } from "~/core/utils/DateFmt";
import Card, { CardBody } from "~/ui/components/card";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";
import { Button } from "~/ui/widgets/button/Button";
import { FTextField } from "~/ui/widgets/form/TextField";
import { LogoCard } from "./components/LogoCard";
import { SettingsCardHeader } from "../components/OrgSettingsHeader";
import { useOrgSettingsStore } from "../layout/OrgSettingsContext";
import { GeneralSettingsContext, useGeneralSettingsStore } from "./GeneralSettingsContext";
import { GeneralSettingsStore } from "./GeneralSettingsStore";
import { InputGroup } from "~/ui/widgets/form/InputGroup";
import { BaseEnv } from "~/core/config/BaseEnv";
import { InputLabel } from "~/ui/widgets/form/InputLabel";

function GeneralSettingsProvider({ children }: { children: ReactNode }) {
    const store = useRef<GeneralSettingsStore | null>(null);
    const layoutStore = useOrgSettingsStore();
    if (store.current === null) {
        store.current = new GeneralSettingsStore({
            layoutStore: layoutStore
        });
    }
    return <GeneralSettingsContext.Provider value={store.current}>{children}</GeneralSettingsContext.Provider>;
}

export default function GeneralSettingsPage() {
    return (
        <GeneralSettingsProvider>
            <PageInner />
        </GeneralSettingsProvider>
    );
}

function PageInner() {
    return (
        <div className="h-full overflow-y-auto">
            <div className="container mx-auto p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <div className="space-y-6">
                        <LogoCard />
                        <OrgDetailsCard />
                    </div>
                </div>
                <div className="xl:col-span-1">
                    <PlanDetailCard />
                </div>
            </div>
        </div>
    );
}





function OrgDetailsCard() {
    const store = useGeneralSettingsStore();
    const fullWebsite = `https://${store.subDomainField.value}.${BaseEnv.instance.rootDomain}`;
    return (
        <Card>
            <SettingsCardHeader title="Organization Details" />
            <CardBody className="p-6">
                <div className="space-y-6">
                    <div>
                        <FTextField
                            label="Name"
                            field={store.orgNameField}
                            placeholder="Enter organization name"
                            aria-describedby="org-name-help"
                        />
                        <div id="org-name-help" className="text-sm text-secondary mt-1">
                            This name will be displayed across the site (for example: on public pages, headers, and emails).
                        </div>
                    </div>


                    <div>
                        <InputLabel htmlFor="subdomain">Website</InputLabel>
                        <InputGroup className="w-full mt-1" aria-describedby="website-help">
                            <InputGroup.Addon>https://</InputGroup.Addon>
                            <InputGroup.Input
                                id="subdomain"
                                disabled={true}
                                value={store.subDomainField.value}
                            />
                            <InputGroup.Addon>{BaseEnv.instance.rootDomain}</InputGroup.Addon>
                        </InputGroup>
                        <div id="website-help" className="text-sm text-secondary mt-1">
                            Your public website is <span className="font-medium">{fullWebsite}</span>. This value can't be changed here — please contact the support team to update it.
                        </div>
                    </div>

                    <div>
                        <Observer>
                            {() => (
                                <Button loading={store.saveSettingsState.isLoading} variant="solid" color="primary" onClick={() => store.saveGeneralSettings()}>
                                    Save Changes
                                </Button>
                            )}
                        </Observer>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}


function PlanDetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <label className="text-sm text-secondary">{label}</label>
            <div className="text-base-m font-medium text-default">{value}</div>
        </div>
    );
}

function PlanDetailCard() {
    const store = useAppStore();
    return (
        <Card>
            <SettingsCardHeader title="Plan Details" />
            <CardBody className="px-6 py-4 space-y-4">
                <PlanDetailItem label="Plan" value={store.planDetail.name} />
                <PlanDetailItem label="Status" value={store.planDetail.status.label} />
                <PlanDetailItem label="Start Date" value={DateFmt.datetime(store.planDetail.startsAt!)} />
                <PlanDetailItem label="End Date" value={DateFmt.datetime(store.planDetail.endsAt!)} />
            </CardBody>
        </Card>
    );
}
