import { AuthConst } from "~/core/const/AuthConst";
import { ApiClient } from "./ApiClient";
import { AppStore } from "~/ui/portal/layout/app/AppStore";

export function addAuthInterceptor({ appStore }: { appStore: AppStore }) {
    const client = ApiClient.findInstance();
    client.axios.interceptors.request.use((request) => {
        const appUser = appStore.optAppUser;
        const authToken = appStore.optAuthToken;
        const orgId = appStore.orgConfig.org.id;
        request.headers[AuthConst.keyOrgId] = orgId;
        if (appUser && authToken) {
            request.headers[AuthConst.keyAuthorization] = authToken.accessToken;
            request.headers[AuthConst.keyAppUserType] = appUser.appUserType.type;
        }
        return request;
    });
}
