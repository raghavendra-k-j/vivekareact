import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { ApiError } from "~/infra/errors/ApiError";
import { PlansListingRes } from "../../pricing/models/PlansListingRes";
import { BillingAddress } from "../models/BillingAddress";
import { CheckoutSummaryReq } from "../models/CalcCheckoutAmountReq";
import { CheckoutRes } from "../models/CheckoutRes";
import { CheckoutSummary } from "../models/CheckoutSummary";
import { CheckoutReq } from "../models/CreatePlanOrderReq";
import { MyOrdersReq, MyOrdersRes } from "../models/MyOrdersRes";
import { PaymentSuccessReq } from "../models/PaymentSuccessReq";
import { PaymentSuccessRes } from "../models/PaymentSuccessRes";
import { PreCheckoutData } from "../models/PreCheckoutData";
import { PreCheckoutDataReq } from "../models/PreCheckoutDataReq";
import { SaveBillingAddressReq } from "../models/SaveBillingAddressReq";

export class BillingService {


    apiClient: ApiClient;

    constructor() {
        this.apiClient = ApiClient.findInstance();
    }

    async getPlans(): Promise<ResEither<AppError, PlansListingRes>> {
        try {
            const response = await this.apiClient.axios.get("/api/v1/billing/plans");
            const plansRes = PlansListingRes.fromJson(response.data);
            return ResEither.data(plansRes);
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }


    async saveBillingAddress(req: SaveBillingAddressReq): Promise<ResEither<AppError, BillingAddress>> {
        try {
            const response = await this.apiClient.axios.post("/api/v1/billing/billing-address", req.toJson());
            const billingAddress = BillingAddress.fromJson(response.data);
            return ResEither.data(billingAddress);
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }


    

    async getPreCheckoutData(req: PreCheckoutDataReq): Promise<ResEither<AppError, PreCheckoutData>> {
        try {
            const response = await this.apiClient.axios.post("/api/v1/billing/pre-checkout", req.toJson());
            const preCheckoutData = PreCheckoutData.fromJson(response.data);
            return ResEither.data(preCheckoutData);
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }



    async getCheckoutSummary(req: CheckoutSummaryReq): Promise<ResEither<AppError, CheckoutSummary>> {
        try {
            const response = await this.apiClient.axios.post("/api/v1/billing/checkout-summary", req.toJson());
            const checkoutSummary = CheckoutSummary.fromJson(response.data);
            return ResEither.data(checkoutSummary);
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }


    async checkout(req: CheckoutReq): Promise<ResEither<AppError, CheckoutRes>> {
        try {
            const response = await this.apiClient.axios.post("/api/v1/billing/checkout", req.toJson());
            const checkoutRes = CheckoutRes.fromJson(response.data);
            return ResEither.data(checkoutRes);
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }




    async paymentSuccess(req: PaymentSuccessReq): Promise<ResEither<AppError, PaymentSuccessRes>> {
        try {
            const response = await this.apiClient.axios.post("/api/v1/billing/orders/plans/checkout/payment-success", req.toJson());
            const paymentSuccessRes = PaymentSuccessRes.fromJson(response.data);
            return ResEither.data(paymentSuccessRes);
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    


    async getMyOrders(req: MyOrdersReq): Promise<ResEither<AppError, MyOrdersRes>> {
        try {
            const response = await this.apiClient.axios.post("/api/v1/billing/orders", req.toJson());
            const myOrdersRes = MyOrdersRes.fromJson(response.data);
            return ResEither.data(myOrdersRes);
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }


}
