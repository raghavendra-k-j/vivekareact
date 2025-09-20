import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { logout } from "~/ui/utils/authRedirectUtils";
import { AuthNavigate } from "../../components/nav/AuthNavigate";
import { useAppStore } from "../../layout/app/AppContext";
import { UserPortalContext, useUserPortalStore } from "./UserPortalContext";
import { UserPortalStore } from "./UserPortalStore";
import { Observer } from "mobx-react-lite";
import { FullCenteredView } from "~/ui/components/common/FullCenteredView";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";

function UserPortalProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<UserPortalStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new UserPortalStore();
    }
    return (<UserPortalContext.Provider value={storeRef.current}>
        {children}
    </UserPortalContext.Provider>);
}


function UserPortalInner() {
    const userPortalStore = useUserPortalStore();
    useEffect(() => {
        if (userPortalStore.userAppConfigState.isInit) {
            userPortalStore.loadUserAppConfig();
        }
    }, [userPortalStore]);

    return (
        <Observer>
            {() => {
                if (userPortalStore.userAppConfigState.isData) {
                    return <Outlet />;
                }
                else if (userPortalStore.userAppConfigState.isError) {
                    return (<FullCenteredView>
                        <SimpleRetryableAppView
                            appError={userPortalStore.userAppConfigState.error}
                            onRetry={() => userPortalStore.loadUserAppConfig()}
                        />
                    </FullCenteredView>);
                }
                else {
                    return (<FullCenteredView>
                        <Outlet />
                    </FullCenteredView>);
                }
            }}
        </Observer>
    );
}

export default function UserPortalLayout() {
    const appStore = useAppStore();

    if (!appStore.hasLoggedInUser) {
        return <AuthNavigate />;
    }
    if (!appStore.authUser.role.isUser) {
        logout({ appStore: appStore });
    }

    return (<UserPortalProvider>
        <UserPortalInner />
    </UserPortalProvider>);
}