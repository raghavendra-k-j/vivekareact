import { AuthConst } from "~/core/const/AuthConst";
import { AppStore } from "~/ui/pages/_layout/AppStore";
import { ApiClient } from "./ApiClient";

export function addAuthInterceptor({ appStore }: { appStore: AppStore }) {
    const client = ApiClient.findInstance();
    client.axios.interceptors.request.use((request) => {
        const appUser = appStore.optAppUser;
        const authToken = appStore.optAuthToken;
        // request.headers[AuthConst.keyAuthorization] = "Basic " + "NDoxMjM0NTY3OA==";
        if (appUser && authToken) {
            request.headers[AuthConst.keyAuthorization] = authToken.accessToken;
            request.headers[AuthConst.keyAppUserType] = appUser.appUserType.type;
        }
        return request;
    });
}
