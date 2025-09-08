import { AuthConst } from "~/core/const/AuthConst";
import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { AppUserType } from "~/domain/common/models/AppUserType";
import { EmailOtpStatus } from "~/domain/common/models/EmailOtpStatus";
import { AuthRepo } from "~/infra/repos/AuthRepo";
import { AutoLoginRes } from "../models/AutoLoginRes";
import { SoftLoginRes } from "../models/SoftLoginRes";

export class AuthService {
    private readonly authRepo: AuthRepo;

    constructor(authRepo: AuthRepo) {
        this.authRepo = authRepo;
    }

    async softLogin(accessToken: string): Promise<ResEither<AppError, SoftLoginRes>> {
        return this.authRepo.softLogin(accessToken);
    }

    async getAccessToken(): Promise<string | null> {
        const accessToken = localStorage.getItem(AuthConst.keyAccessToken);
        return accessToken ? accessToken : null;
    }

    async removeTokenLocally() {
        localStorage.removeItem(AuthConst.keyAccessToken);
        localStorage.removeItem(AuthConst.keyAppUserType);
    }

    async saveTokenLocally({ accessToken, appUserType }: { accessToken: string, appUserType: AppUserType }) {
        localStorage.setItem(AuthConst.keyAccessToken, accessToken);
        localStorage.setItem(AuthConst.keyAppUserType, appUserType.type);
    }

    async checkAuthEmailOTPStatus(otpId: number): Promise<ResEither<AppError, EmailOtpStatus | null>> {
        return this.authRepo.checkAuthEmailOTPStatus(otpId);
    }

    async autoLogin({ tempAuthToken, userId }: { tempAuthToken: string, userId: number }): Promise<ResEither<AppError, AutoLoginRes>> {
        return this.authRepo.autoLogin({ tempAuthToken, userId });
    }

    async clearTokenLocally() {
        localStorage.removeItem(AuthConst.keyAccessToken);
        localStorage.removeItem(AuthConst.keyAppUserType);
    }
}
