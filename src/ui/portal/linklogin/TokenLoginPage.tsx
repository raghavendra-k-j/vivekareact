import { useEffect } from "react";
import { AppUserType } from "~/domain/common/models/AppUserType";
import { useLocation, useNavigate } from "react-router";
import { PageLoader } from "~/ui/components/loaders/PageLoader";
import { AuthConst } from "~/core/const/AuthConst";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";

export default function TokenLoginPage() {
    const appStore = useAppStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleTokenLogin = async () => {
            const params = new URLSearchParams(location.search);
            const accessToken = params.get(AuthConst.keyAccessToken);
            const redirect = params.get(AuthConst.keyRedirect);
            if (accessToken) {
                await appStore.authService.saveTokenLocally({
                    accessToken,
                    appUserType: AppUserType.auth,
                });
                await appStore.trySoftLogin();

                if (redirect) {
                    navigate(redirect, { replace: true });
                }
            }
        };
        handleTokenLogin();
    }, [location.search, appStore, navigate]);

    return <PageLoader />;
}
