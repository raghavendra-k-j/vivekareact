import { useEffect, useState } from "react";
import { AppProvider } from "./AppProvider";
import { bootApp, getOrgConfig } from "../bootApp";
import { AppEnv } from "~/core/config/AppEnv";
import { Outlet } from "react-router";


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


    return (<AppProvider softLogin={props.softLogin} appEnv={AppEnv.instance} orgConfig={getOrgConfig()}>
        <Outlet />
    </AppProvider>);
}
