import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { AppEnv } from "~/core/config/AppEnv";
import type { OrgConfig } from "~/domain/common/models/OrgConfig";
import { PageLoader } from "~/ui/components/loaders/PageLoader";
import { bootApp, getAuthService, getConfigService, getOrgConfig } from "../bootApp";
import { AppContext } from "./AppContext";
import { AppStore } from "./AppStore";


export type AppLayoutProps = {
    softLogin: boolean;
}

export default function AppLayout(props: AppLayoutProps) {
    const [isBooted, setIsBooted] = useState(false);

    useEffect(() => {
        async function callBootApp() {
            await bootApp();
            setIsBooted(true);
        }
        callBootApp();
    });

    if (!isBooted) {
        return null;
    }

    return (<AppProvider
        softLogin={props.softLogin}
        appEnv={AppEnv.instance}
        orgConfig={getOrgConfig()}
    >
        <Outlet />
    </AppProvider>);
}


export type AppProviderProps = {
    children: React.ReactNode;
    appEnv: AppEnv;
    orgConfig: OrgConfig;
    softLogin: boolean;
}

export function AppProvider(props: AppProviderProps) {
    const appStoreRef = useRef<AppStore | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();

    if (!appStoreRef.current) {
        appStoreRef.current = new AppStore({
            appEnv: props.appEnv,
            orgConfig: props.orgConfig,
            configService: getConfigService(),
            authService: getAuthService(),
            navigate: navigate
        });
    }

    useEffect(() => {
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
            {props.children}
        </AppContext.Provider>
    );
}