import { AppError } from "~/core/error/AppError";
import { JsonObj } from "~/core/types/Json";
import { ResEither } from "~/core/utils/ResEither";
import { UserRoleBase } from "~/domain/common/models/UserRoleBase";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { ApiError } from "~/infra/errors/ApiError";
import { AdminQueryRolesRes } from "../models/AdminQueryRolesModels";
import { AdminUserRoleItem } from "../models/AdminUserRoleItem";
import { UserPermission } from "../models/UserPermission";


/* 

import 'package:flutterapp/org/data/data_source/admin_api_client.dart';
import 'package:flutterapp/org/domain/entities/user/admin_create_role_req.dart';
import 'package:flutterapp/org/domain/entities/user/admin_query_roles.dart';
import 'package:flutterapp/org/domain/entities/user/admin_update_role_req.dart';
import 'package:flutterapp/org/domain/entities/user/admin_user_role_item.dart';
import 'package:flutterapp/org/domain/entities/user/update_role_order.dart';
import 'package:flutterapp/org/domain/entities/user/user_permission.dart';
import 'package:flutterapp/org/domain/entities/user/user_role_base.dart';
import 'package:flutterapp/org/domain/repositories/user/admin_manage_roles_repo.dart';

class IAdminManageRolesRepo implements AdminManageRolesRepo {
  final AdminApiClient _adminApiClient;

  IAdminManageRolesRepo({
    required AdminApiClient adminApiClient,
  }) : _adminApiClient = adminApiClient;

  @override
  Future<AdminUserRoleItem> createRole(AdminCreateRoleReq req) async {
    final result = await _adminApiClient.dio.post('/roles', data: req.toMap());
    return AdminUserRoleItem.fromMap(result.data);
  }

  @override
  Future<void> updateDOrder(UpdateRoleOrderReq req) async {
    await _adminApiClient.dio.post('/roles/update-d-order', data: req.toMap());
  }

  @override
  Future<AdminUserRoleItem> updateRole(AdminUpdateRoleReq req) async {
    final result = await _adminApiClient.dio.post('/roles/${req.id}/update', data: req.toMap());
    return AdminUserRoleItem.fromMap(result.data);
  }
}

*/

export class AdminRolesService {

    private apiClient: ApiClient;

    constructor() {
        this.apiClient = ApiClient.findInstance();
    }

    get axios() {
        return this.apiClient.axios;
    }

    baseUrl(path: string) {
        return `/api/v1/admin${path}`;
    }

    async deleteRole(id: number): Promise<ResEither<AppError, void>> {
        try {
            await this.axios.delete(this.baseUrl(`/roles/${id}`));
            return ResEither.data(undefined);
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async lookupRoles(): Promise<ResEither<AppError, UserRoleBase[]>> {
        try {
            const res = await this.axios.get(this.baseUrl('/roles/lookup'));
            return ResEither.data((res.data as JsonObj[]).map((item) => UserRoleBase.fromJson(item)));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }


    async queryRoles(): Promise<ResEither<AppError, AdminQueryRolesRes>> {
        try {
            const res = await this.axios.post(this.baseUrl('/roles/query'));
            return ResEither.data(AdminQueryRolesRes.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async queryRoleById(id: number): Promise<ResEither<AppError, AdminUserRoleItem>> {
        try {
            const res = await this.axios.get(this.baseUrl(`/roles/${id}`));
            return ResEither.data(AdminUserRoleItem.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async queryPermissions(): Promise<ResEither<AppError, UserPermission[]>> {
        try {
            const res = await this.axios.get(this.baseUrl('/roles/permissions'));
            return ResEither.data((res.data as JsonObj[]).map((item) => UserPermission.fromJson(item)));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }
}