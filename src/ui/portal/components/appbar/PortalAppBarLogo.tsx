import { ServiceUrl } from "~/infra/datasources/ServiceUrl";
import { BaseNamedLogo } from "~/ui/components/logo/BaseLogo";
import { AppUrl } from "~/infra/utils/AppUrl";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";

export function PortalAppBarLogo() {
    const appStore = useAppStore();
    const org = appStore.orgConfig.org;
    let logoUrl = org.logoUrl ? ServiceUrl.getUrl(`/${org.logoUrl}`) : null;
    if (logoUrl) {
        return (
            <a href={AppUrl.home}>
                <img
                    src={logoUrl}
                    alt={org.name}
                    style={{
                        objectFit: "contain",
                        display: "block",
                    }}
                    className="h-auto max-h-9 w-auto max-w-60"
                />
            </a>
        );
    }
    return (<div className="font-bold">{org.name}</div>);
    return (<BaseNamedLogo textClassName="text-default" />);
}