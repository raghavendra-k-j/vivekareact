import { AuthRes } from "../models/AuthRes";
import { ResEither } from "~/core/utils/ResEither";
import { AuthRepo } from "~/infra/repos/AuthRepo";
import Cookies from 'js-cookie'
import { AuthConst } from "~/core/const/AuthConst";
import { EmailOtpStatus } from "~/domain/common/models/EmailOtpStatus";
import { AppUserType } from "~/domain/common/models/AppUserType";
import { AutoLoginRes } from "../models/AutoLoginRes";
import { AppError } from "~/core/error/AppError";

export class AuthService {

    private readonly authRepo: AuthRepo;

    constructor(authRepo: AuthRepo) {
        this.authRepo = authRepo;
    }

    async softLogin(accessToken: string): Promise<ResEither<AppError, AuthRes>> {
        return this.authRepo.softLogin(accessToken);
    }

    async getAccessToken(): Promise<string | null> {
        const accessToken = Cookies.get(AuthConst.keyAccessToken) || null;
        console.info("AuthService: getAccessToken: accessToken=", accessToken);
        return accessToken;
    }

    async removeTokenLocally() {
        Cookies.remove(AuthConst.keyAccessToken);
        Cookies.remove(AuthConst.keyAppUserType);
    }

    async saveTokenLocally({ accessToken, appUserType }: { accessToken: string, appUserType: AppUserType }) {
        if (typeof window === "undefined") {
            console.warn("saveTokenLocally called on server — cookies not available");
            return;
        }
        else {
            console.info("AuthService: saveTokenLocally called on client");
        }

        console.info("AuthService: saveTokenLocally: accessToken=", accessToken);
        console.info("AuthService: saveTokenLocally: appUserType=", appUserType);

        Cookies.set(AuthConst.keyAccessToken, accessToken);
        Cookies.set(AuthConst.keyAppUserType, appUserType.type);

        console.info("document.cookie=", document.cookie);
        console.info("saved token=", Cookies.get(AuthConst.keyAccessToken));
        console.info("saved appUserType=", Cookies.get(AuthConst.keyAppUserType));
    }

    async checkAuthEmailOTPStatus(otpId: number): Promise<ResEither<AppError, EmailOtpStatus | null>> {
        return this.authRepo.checkAuthEmailOTPStatus(otpId);
    }

    async autoLogin({ tempAuthToken, userId }: { tempAuthToken: string, userId: number }): Promise<ResEither<AppError, AutoLoginRes>> {
        return this.authRepo.autoLogin({ tempAuthToken, userId });
    }

    async clearTokenLocally() {
        Cookies.remove(AuthConst.keyAccessToken);
        Cookies.remove(AuthConst.keyAppUserType);
    }

}