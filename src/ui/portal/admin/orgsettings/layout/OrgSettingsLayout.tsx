import { Observer } from "mobx-react-lite";
import { ReactNode, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import { useIsLinkActive } from "~/ui/hooks/useIsLinkActive";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { TabItem } from "~/ui/widgets/tabs/TabItem";
import { TabsList } from "~/ui/widgets/tabs/TabList";
import { AdminPageAppBar, AdminPageAppBarTitle } from "../../components/PageAppBar";
import { OrgSettingsContext, useOrgSettingsStore } from "./OrgSettingsContext";
import { OrgSettingsStore } from "./OrgSettingsStore";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";

function OrgSettingsProvider({ children }: { children: ReactNode }) {
    const store = useRef<OrgSettingsStore | null>(null);
    const appStore = useAppStore();
    if (store.current === null) {
        store.current = new OrgSettingsStore({
            appStore: appStore,
        });
    }
    return <OrgSettingsContext.Provider value={store.current}>
        {children}
    </OrgSettingsContext.Provider>;
}

export default function OrgSettingsLayout() {
    return (<OrgSettingsProvider>
        <PageInner />
    </OrgSettingsProvider>
    );
}

function PageInner() {
    const store = useOrgSettingsStore();
    useEffect(() => {
        store.loadGeneralSettings();
    }, [store]);

    return (<div className="w-full h-full overflow-y-hidden flex flex-col">
        <AdminPageAppBar start={<AdminPageAppBarTitle title="Organization Settings" />} bottom={<Tabs />} />
        <Observer>
            {() => {
                return store.orgSettingsState.stateWhen({
                    initOrLoading: () => (<CenteredView><LoaderView /></CenteredView>),
                    loaded: () => (<Outlet />),
                    error: (err) => (<CenteredView><SimpleRetryableAppView appError={err} onRetry={() => store.loadGeneralSettings()} /></CenteredView>),
                });
            }}
        </Observer>
    </div>);
}

function CenteredView({ children }: { children: ReactNode }) {
    return (
        <div className="flex-grow flex items-center justify-center p-6">
            {children}
        </div>
    );
}



function Tabs() {
    const navigate = useNavigate();
    const tabs = [
        { to: "/console/org-settings/general", label: "General" },
        { to: "/console/org-settings/entitydict", label: "Terminologies" },
        { to: "/console/org-settings/userapp", label: "User Website Settings" },
    ];
    return (
        <TabsList >
            {tabs.map(t => {
                const isTabActive = useIsLinkActive(t.to, true);
                return (
                    <TabItem
                        key={t.to}
                        isActive={isTabActive}
                        onClick={() => navigate(t.to)}
                    >
                        {t.label}
                    </TabItem>
                );
            })}
        </TabsList>
    );
}
