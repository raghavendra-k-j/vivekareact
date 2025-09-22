import { makeObservable, observable, runInAction } from "mobx";
import { NavigateFunction } from "react-router";
import type { AppEnv } from "~/core/config/AppEnv";
import { AppError } from "~/core/error/AppError";
import { logger } from "~/core/utils/logger";
import { BaseAuthRes } from "~/domain/auth/models/BaseAuthRes";
import { AuthService } from "~/domain/auth/services/AuthService";
import { AbsUser } from "~/domain/common/models/AbsUser";
import { AuthToken } from "~/domain/common/models/AuthToken";
import { AuthUser } from "~/domain/common/models/AuthUser";
import { Org } from "~/domain/common/models/Org";
import type { OrgConfig } from "~/domain/common/models/OrgConfig";
import { PlanAndUsage } from "~/domain/common/models/PlanAndUsage";
import { ConfigService } from "~/domain/common/services/ConfigService";
import { EntityCatalog } from "~/domain/entitydict/models/EntityCatalog";
import { addAuthInterceptor } from "~/infra/datasources/apiClientHelper";
import type { BrowserInfo } from "~/infra/utils/deviceinfo/BrowserInfo";
import { BrowserInfoUtil } from "~/infra/utils/deviceinfo/BrowserInfoUtil";
import { DataState } from "~/ui/utils/DataState";

export class AppStore {

    private _appEnv: AppEnv;
    private _orgConfig: OrgConfig;
    private _deviceInfo: BrowserInfo | null = null;
    private _authService: AuthService;
    private _configService: ConfigService;
    public _appUser: AbsUser | null = null;
    private _authToken: AuthToken | null = null;
    public navigate: NavigateFunction;

    public _authState: DataState<void> = DataState.init();
    public _planAndUsage: PlanAndUsage | null = null;
    public _planAndUsageState: DataState<void> = DataState.init();
    public _entityDictResState: DataState<void> = DataState.init();
    public _entityCatalog: EntityCatalog | null = null;


    static Provider: any;

    get entityCatalog() {
        return this._entityCatalog!
    }

    get orgConfig(): OrgConfig {
        return this._orgConfig;
    }

    get appUser(): AbsUser {
        return this._appUser!;
    }

    get apiBaseUrl(): string {
        return this._appEnv.apiUrl;
    }

    get hasUser(): boolean {
        return this._appUser !== null;
    }

    get hasLoggedInUser(): boolean {
        if (!this._appUser) {
            return false;
        }
        if (this._appUser.appUserType.isAuthUser) {
            return true;
        }
        return false;
    }


    get hasAdminUser(): boolean {
        if (!this._appUser) {
            return false;
        }
        if (!this._appUser.appUserType.isAuthUser) {
            return false;
        }
        return this.authUser.role.isAdmin;
    }

    get authUser(): AuthUser {
        return this.appUser as AuthUser;
    }


    get optAppUser(): AbsUser | null {
        return this._appUser;
    }

    get authToken(): AuthToken {
        return this._authToken!;
    }

    get optAuthToken(): AuthToken | null {
        return this._authToken;
    }

    get planAndUsage(): PlanAndUsage {
        return this._planAndUsage!;
    }

    get optPlanAndUsage(): PlanAndUsage | null {
        return this._planAndUsage;
    }

    get planDetail() {
        return this._planAndUsage!.planDetail!;
    }

    get optPlanDetail() {
        return this._planAndUsage?.planDetail ?? null;
    }

    get usageDetail() {
        return this._planAndUsage!.usageDetail!;
    }

    get optUsageDetail() {
        return this._planAndUsage?.usageDetail ?? null;
    }

    get authService(): AuthService {
        return this._authService;
    }

    get configService(): ConfigService {
        return this._configService;
    }

    updateOrg(newOrgConfig: Org) {
        this._orgConfig = this._orgConfig.copyWith({ org: newOrgConfig });
    }


    constructor({ appEnv, orgConfig, configService, authService, navigate }: { appEnv: AppEnv, orgConfig: OrgConfig, configService: ConfigService, authService: AuthService, navigate: NavigateFunction }) {
        this._appEnv = appEnv;
        this._orgConfig = orgConfig;
        this.navigate = navigate;
        addAuthInterceptor({ appStore: this });
        makeObservable(this, {
            _appUser: observable.ref,
            _planAndUsageState: observable.ref,
            _authState: observable.ref,
            _planAndUsage: observable.ref,
        });
        this._configService = configService;
        this._authService = authService;
    }

    get deviceInfo(): BrowserInfo {
        if (this._deviceInfo) {
            return this._deviceInfo;
        }
        const deviceInfo = BrowserInfoUtil.getDeviceInfo();
        this._deviceInfo = deviceInfo;
        return deviceInfo;
    }

    async trySoftLogin() {
        try {
            runInAction(() => {
                this._authState = DataState.loading();
            });
            const accessToken = await this._authService.getAccessToken();
            if (!accessToken) {
                throw new Error("accessToken is null");
            }
            const res = (await this._authService.softLogin(accessToken)).getOrError();
            await this.updateAuthResponse({
                baseAuthRes: res.baseAuthRes,
                authToken: AuthToken.fromAccessToken(accessToken),
            });
            await this.loadPlanAndUsage();
            runInAction(() => {
                this._authState = DataState.data(undefined);
            });
        }
        catch (err) {
            logger.error("softLogin error", err);
            const appError = AppError.fromAny(err);
            this._authState = DataState.error(appError);
        }
    }

    async loadPlanAndUsage() {
        try {
            runInAction(() => this._planAndUsageState = DataState.loading());
            const response = (await this._configService.planAndUsage()).getOrError();
            runInAction(() => {
                this._planAndUsage = response;
                this._planAndUsageState = DataState.data(undefined);
            });
        }
        catch (error) {
            logger.error("Error loading plan and usage", error);
            const appError = AppError.fromAny(error);
            runInAction(() => this._planAndUsageState = DataState.error(appError));
        }
    }

    async refreshPlanAndUsage() {
        try {
            const response = (await this._configService.planAndUsage()).getOrError();
            runInAction(() => {
                this._planAndUsage = response;
                this._planAndUsageState = DataState.data(undefined);
            });
        }
        catch (error) {
            logger.error("Error refreshing plan and usage", error);
            const appError = AppError.fromAny(error);
            runInAction(() => this._planAndUsageState = DataState.error(appError));
        }
    }

    async updateAuthResponse({ baseAuthRes, authToken }: { baseAuthRes: BaseAuthRes, authToken: AuthToken }) {
        const user = baseAuthRes.user;
        await this._authService.clearTokenLocally();
        await this._authService.saveTokenLocally({
            accessToken: authToken.accessToken,
            appUserType: user.appUserType,
        });
        runInAction(() => {
            this._appUser = user;
            this._authToken = authToken;
            this._planAndUsage = baseAuthRes.planAndUsage;
            this._planAndUsageState = DataState.data(undefined);
            this._entityCatalog = baseAuthRes.entityCatalog;
            this._entityDictResState = DataState.data(undefined);
        });
    }


    navigateToLogin() {
        const loginUrl = this._appEnv.webBase + "/login";
        window.location.href = loginUrl;
    }

    clearAuth() {
        runInAction(() => {
            this._appUser = null;
            this._authToken = null;
            this._authState = DataState.init();
            this._planAndUsage = null;
            this._planAndUsageState = DataState.init();
        });
    }


    async logoutAndGoToLogin() {
        await this._authService.removeTokenLocally();
        runInAction(() => {
            this._appUser = null;
            this._authState = DataState.init();
        });
        window.location.reload();
    }
}