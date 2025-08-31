import { useEffect, useRef, useState } from "react";
import { AppContext } from "./AppContext";
import { AppStore } from "./AppStore";
import type { AppEnv } from "~/core/config/AppEnv";
import type { OrgConfig } from "~/domain/common/models/OrgConfig";
import { DialogManagerProvider } from "~/ui/widgets/dialogmanager";
import { ToastContainer } from "react-toastify";
import { PageLoader } from "~/ui/components/loaders/PageLoader";
import { getAuthService, getConfigService } from "../bootApp";

export type AppProviderProps = {
    children: React.ReactNode;
    appEnv: AppEnv;
    orgConfig: OrgConfig;
    softLogin: boolean;
}

export function AppProvider(props: AppProviderProps) {

    const appStoreRef = useRef<AppStore | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    if (!appStoreRef.current) {
        appStoreRef.current = new AppStore({
            appEnv: props.appEnv,
            orgConfig: props.orgConfig,
            configService: getConfigService(),
            authService: getAuthService(),
        });
    }

    useEffect(() => {
        const location = window.location.href;
        console.info("AppProvider: softLogin=", props.softLogin, " location=", location);
        if (props.softLogin === true) {
            (async () => {
                await appStoreRef.current?.trySoftLogin();
                setIsInitialized(true);
            })();
        }
        else {
            setIsInitialized(true);
        }
    }, [props.softLogin]);


    if (!isInitialized) {
        return <PageLoader />;
    }

    return (
        <AppContext.Provider value={appStoreRef.current}>
            <DialogManagerProvider>
                {props.children}
            </DialogManagerProvider>
            <ToastContainer position="bottom-right" />
        </AppContext.Provider>
    );
}
