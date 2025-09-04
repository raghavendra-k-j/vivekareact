import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { SignUpFinishSetupReq, SignUpFinishSetupRes } from "~/domain/main/auth/models/FinishSetupModels";
import { PreSignUpData } from "~/domain/main/auth/models/PreSignUpData";
import { SignUpInitReq, SignUpInitRes } from "~/domain/main/auth/models/SignUpInitModels";
import { SignUpSendCodeReq, SignUpSendCodeRes } from "~/domain/main/auth/models/SignUpSendCodeModels";
import { SignUpVerifyCodeReq, SignUpVerifyCodeRes } from "~/domain/main/auth/models/VerifyCodeModels";
import { OrgAuthRepo } from "~/infra/repos/OrgAuthRepo";

export class OrgAuthService {

    orgAuthRepo: OrgAuthRepo;

    constructor(props: { orgAuthRepo: OrgAuthRepo }) {
        this.orgAuthRepo = props.orgAuthRepo;
    }

    async signUpInit(req: SignUpInitReq): Promise<ResEither<AppError, SignUpInitRes>> {
        return await this.orgAuthRepo.signUpInit(req);
    }

    async getPreSignUpData(): Promise<ResEither<AppError, PreSignUpData>> {
        return await this.orgAuthRepo.getPreSignUpData();
    }

    async signUpSendCode(req: SignUpSendCodeReq): Promise<ResEither<AppError, SignUpSendCodeRes>> {
        return await this.orgAuthRepo.signUpSendCode(req);
    }

    async signUpVerifyCode(req: SignUpVerifyCodeReq): Promise<ResEither<AppError, SignUpVerifyCodeRes>> {
        return await this.orgAuthRepo.signUpVerifyCode(req);
    }

    async signUpFinishSetup(req: SignUpFinishSetupReq): Promise<ResEither<AppError, SignUpFinishSetupRes>> {
        return await this.orgAuthRepo.signUpFinishSetup(req);
    }

}