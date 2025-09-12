import { AuthConst } from "~/core/const/AuthConst";
import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { AppUserType } from "~/domain/common/models/AppUserType";
import { EmailOtpStatus } from "~/domain/common/models/EmailOtpStatus";
import { AuthRepo } from "~/infra/repos/AuthRepo";
import { AutoLoginRes } from "../models/AutoLoginRes";
import { LoginRes } from "../models/LoginRes";
import { SoftLoginRes } from "../models/SoftLoginRes";

/* 

import 'package:flutterapp/commons/domain/entities/email_otp_status.dart';
import 'package:flutterapp/commons/exception/app_exception.dart';
import 'package:flutterapp/commons/exception/network_exception.dart';
import 'package:flutterapp/commons/utils/either.dart';
import 'package:flutterapp/commons/utils/js_interop_service.dart';
import 'package:flutterapp/commons/utils/pair.dart';
import 'package:flutterapp/org/domain/const/auth_const.dart';
import 'package:flutterapp/org/domain/entities/commons/auth_token.dart';
import 'package:flutterapp/org/domain/entities/commons/forgot_pass.dart';
import 'package:flutterapp/org/domain/entities/commons/get_app_user_request.dart';
import 'package:flutterapp/org/domain/entities/commons/get_app_user_response.dart';
import 'package:flutterapp/org/domain/entities/commons/login_res.dart';
import 'package:flutterapp/org/domain/entities/commons/reset_pass.dart';
import 'package:flutterapp/org/domain/entities/commons/signup_req.dart';
import 'package:flutterapp/org/domain/entities/commons/soft_login_res.dart';
import 'package:flutterapp/org/domain/repositories/commons/auth_repo.dart';
import 'package:flutterapp/org/infrastructure/org_app_state.dart';

class AuthService {
  final AuthRepo _authRepo;
  late OrgAppState orgAppState;

  AuthService({
    required AuthRepo authRepo,
  }) : _authRepo = authRepo;

  Future<Either<AppException, LoginRes>> autoLogin({required String tempAuthToken, required int userId}) async {
    try {
      final response = await _authRepo.autoLogin(tempAuthToken: tempAuthToken, userId: userId);
      return Right(response);
    } catch (e) {
      final AppException exception = NetworkException.fromDioError(e);
      return Left(exception);
    }
  }

  Future<Either<AppException, GetAppUserResponse>> getAppUserResponse(GetAppUserRequest request) async {
    try {
      final response = await _authRepo.getAppUser(request);
      return Right(response);
    } catch (e) {
      final AppException exception = NetworkException.fromDioError(e);
      return Left(exception);
    }
  }

  Future<Either<AppException, GetAppUserResponse>> verifyGetAppUser({
    required int id,
    required String otp,
    required int formId,
  }) async {
    try {
      final response = await _authRepo.verifyGetAppUser(id: id, otp: otp, formId: formId);
      return Right(response);
    } catch (e) {
      final AppException exception = NetworkException.fromDioError(e);
      return Left(exception);
    }
  }

  Future<Either<AppException, int>> resendSubmitFormOtp({required int otpId, required int formId}) async {
    try {
      final response = await _authRepo.resendSubmitFormOtp(otpId: otpId, formId: formId);
      return Right(response);
    } catch (e) {
      final AppException exception = NetworkException.fromDioError(e);
      return Left(exception);
    }
  }

  Future<Either<AppException, SoftLoginRes>> softLogin({required AuthToken authToken}) async {
    try {
      final response = await _authRepo.softLogin(authToken: authToken);
      return Right(response);
    } catch (e) {
      final AppException exception = NetworkException.fromDioError(e);
      return Left(exception);
    }
  }

  Future<Either<AppException, LoginRes>> login({required String identifier, required String password}) async {
    try {
      final response = await _authRepo.login(identifier: identifier, password: password);
      return Right(response);
    } catch (e) {
      final AppException exception = NetworkException.fromDioError(e);
      return Left(exception);
    }
  }

  Future<Either<AppException, SendCodeRes>> sendForgotPasswordCode({required String email}) async {
    try {
      final response = await _authRepo.sendForgotPasswordCode(email: email);
      return Right(response);
    } catch (e) {
      final AppException exception = NetworkException.fromDioError(e);
      return Left(exception);
    }
  }

  Future<Either<AppException, VerifyCodeRes>> verifyForgotPassCode({required int otpId, required String otp}) async {
    try {
      final response = await _authRepo.verifyForgotPassCode(
        otpId: otpId,
        otp: otp,
      );
      return Right(response);
    } catch (e) {
      final AppException exception = NetworkException.fromDioError(e);
      return Left(exception);
    }
  }

  Future<Either<AppException, SignUpRes>> signUp({required SignUpReq req}) async {
    try {
      final response = await _authRepo.signUp(req: req);
      return Right(response);
    } catch (e) {
      final AppException exception = NetworkException.fromDioError(e);
      return Left(exception);
    }
  }

  Future<Either<AppException, SignUpSuccessResponse>> verifyEmail(
      {required String requestToken, required String otp}) async {
    try {
      final response = await _authRepo.verifyEmail(requestToken: requestToken, otp: otp);
      return Right(response);
    } catch (e) {
      final AppException exception = NetworkException.fromDioError(e);
      return Left(exception);
    }
  }

  Future<Either<AppException, AuthToken?>> getAuthToken() {
    JsInteropService jsInteropService = JsInteropService();
    String? accessToken = jsInteropService.getCookie(AuthConst.keyAccessToken);
    if (accessToken == null) {
      return Future.value(Right(null));
    }
    AuthToken authToken = AuthToken(accessToken: accessToken);
    return Future.value(Right(authToken));
  }

  Future<void> saveAuthTokenOnly(AuthToken authToken) {
    JsInteropService jsInteropService = JsInteropService();
    jsInteropService.setCookie(
      name: AuthConst.keyAccessToken,
      value: authToken.accessToken,
      minutes: AuthConst.credentialsExpiryMinutes,
    );
    return Future.value();
  }

  Future<void> saveAuthToken(
    AuthToken authToken, {
    required String identifier,
    required String? password,
    required bool rememberMe,
  }) {
    JsInteropService jsInteropService = JsInteropService();
    jsInteropService.setCookie(
      name: AuthConst.keyAccessToken,
      value: authToken.accessToken,
      minutes: AuthConst.credentialsExpiryMinutes,
    );
    if (rememberMe) {
      jsInteropService.setCookie(
        name: AuthConst.keySavedIdentifier,
        value: identifier,
        minutes: AuthConst.credentialsExpiryMinutes,
      );
      password ??= '';
      jsInteropService.setCookie(
        name: AuthConst.keySavedPassword,
        value: password,
        minutes: AuthConst.credentialsExpiryMinutes,
      );
    } else {
      jsInteropService.removeCookie(AuthConst.keySavedIdentifier);
      jsInteropService.removeCookie(AuthConst.keySavedPassword);
    }
    return Future.value();
  }

  Future<Pair<String?, String?>> getSavedCredentials() async {
    JsInteropService jsInteropService = JsInteropService();
    String? identifier = jsInteropService.getCookie(AuthConst.keySavedIdentifier);
    String? password = jsInteropService.getCookie(AuthConst.keySavedPassword);
    return Pair(identifier, password);
  }

  Future<String?> getSavedIdentifier() async {
    JsInteropService jsInteropService = JsInteropService();
    return jsInteropService.getCookie(AuthConst.keySavedIdentifier);
  }

  Future<void> removeAuthToken() {
    JsInteropService jsInteropService = JsInteropService();
    jsInteropService.removeCookie(AuthConst.keyAccessToken);
    return Future.value();
  }

  Future<Either<AppException, void>> logout() async {
    try {
      await _authRepo.logout();
      return Right(null);
    } catch (e) {
      final AppException exception = NetworkException.fromDioError(e);
      return Left(exception);
    }
  }

  Future<Either<AppException, EmailOtpStatus?>> checkAuthEmailOTPStatus({required int otpId}) async {
    try {
      final response = await _authRepo.checkAuthEmailOTPStatus(otpId: otpId);
      return Right(response);
    } catch (e) {
      final AppException exception = NetworkException.fromDioError(e);
      return Left(exception);
    }
  }

  Future<Either<AppException, ResetPassRes>> resetPass({
    required String? resetPasswordToken,
    required String? currentPassword,
    required String newPassword,
    required bool isFromLogin,
  }) async {
    try {
      final res = await _authRepo.resetPassword(
        resetPasswordToken: resetPasswordToken,
        currentPassword: currentPassword,
        newPass: newPassword,
        isFromLogin: isFromLogin,
      );
      return Right(res);
    } catch (e) {
      final AppException exception = NetworkException.fromDioError(e);
      return Left(exception);
    }
  }
}

*/


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

    async login({ identifier, password }: { identifier: string, password: string }): Promise<ResEither<AppError, LoginRes>> {
        return await this.authRepo.login({ identifier, password });
    }


}
