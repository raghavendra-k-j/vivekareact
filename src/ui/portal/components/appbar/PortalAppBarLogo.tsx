import { ServiceURL } from "~/infra/datasources/ServiceURL";
import { BaseNamedLogo } from "~/ui/components/logo/BaseLogo";
import { AppUrl } from "~/infra/utils/AppUrl";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";

export function PortalAppBarLogo() {
    const appStore = useAppStore();
    let logoUrl = appStore.orgConfig.org.logoUrl ? ServiceURL.getUrl(`/${appStore.orgConfig.org.logoUrl}`) : null;
    if (logoUrl) {
        return (
            <a href={AppUrl.home}>
                <img
                    src={logoUrl}
                    alt={appStore.orgConfig.org.name}
                    style={{
                        objectFit: "contain",
                        display: "block",
                    }}
                    className="h-auto max-h-9 w-auto max-w-60"
                />
            </a>
        );
    }
    return (<BaseNamedLogo textClassName="text-default" />);
}