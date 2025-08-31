import { SoftLoginRes } from "../models/SoftLoginRes";
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

    async softLogin(accessToken: string): Promise<ResEither<AppError, SoftLoginRes>> {
        return this.authRepo.softLogin(accessToken);
    }

    async getAccessToken(): Promise<string | null> {
        const accessToken = Cookies.get(AuthConst.keyAccessToken) || null;
        return accessToken;
    }

    async removeTokenLocally() {
        Cookies.remove(AuthConst.keyAccessToken);
        Cookies.remove(AuthConst.keyAppUserType);
    }

    async saveTokenLocally({ accessToken, appUserType }: { accessToken: string, appUserType: AppUserType }) {
        Cookies.set(AuthConst.keyAccessToken, accessToken, {expires: AuthConst.cookieExpiresDays});
        Cookies.set(AuthConst.keyAppUserType, appUserType.type, {expires: AuthConst.cookieExpiresDays});
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