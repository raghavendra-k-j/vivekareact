import { makeObservable, observable, runInAction } from "mobx";
import { NavigateFunction } from "react-router";
import { AppError } from "~/core/error/AppError";
import { CheckoutOrderItemReq } from "~/domain/billing/common/models/CheckoutOrderItemReq";
import { ProductType } from "~/domain/billing/common/models/ProductType";
import { BillingIntervalPlans } from "~/domain/billing/pricing/models/PlansListingRes";
import { PricedPlan } from "~/domain/billing/pricing/models/PricedPlan";
import { DataState } from "~/ui/utils/DataState";
import { showErrorToast } from "~/ui/widgets/toast/toast";
import { PlansPageVm } from "./models/PricingDetailVm";
import { BillingLayoutStore } from "../layout/BillingLayoutStore";

export type PlansPageStoreProps = {
    billingStore: BillingLayoutStore;
    navigate: NavigateFunction;
}

export class PlansPageStore {


    billingStore: BillingLayoutStore;
    navigate: NavigateFunction;

    vmState: DataState<PlansPageVm> = DataState.init();

    selectedInterval: BillingIntervalPlans | null = null;

    constructor(props: PlansPageStoreProps) {
        this.billingStore = props.billingStore;
        this.navigate = props.navigate;
        makeObservable(this, {
            vmState: observable.ref,
            selectedInterval: observable.ref,
        });
    }

    get currency() {
        return this.vm.currency;
    }

    get billingService() {
        return this.billingStore.billingService;
    }

    get vm() {
        return this.vmState.data!;
    }

    get billingIntervalPlans() {
        return this.vm.billingIntervalPlans;
    }


    onBillingIntervalChange(value: string): void {
        const interval = this.billingIntervalPlans.find((i) => i.billingInterval.value === value);
        runInAction(() => {
            this.selectedInterval = interval || null;
        });
    }

    async loadPlans() {
        try {
            runInAction(() => {
                this.vmState = DataState.loading();
            });
            const res = (await this.billingService.getPlans()).getOrError();
            let data: PlansPageVm = PlansPageVm.fromModel(res);
            runInAction(() => {
                this.vmState = DataState.data(data);
                this.selectedInterval = data.billingIntervalPlans[0] || null;
            });
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.vmState = DataState.error(appError);
            });
        }
    }

    async purchasePlan(pricedPlan: PricedPlan) {
        // Allow Purchase if only payment gateway is available for that country
        if (!this.vm.paymentProcessor?.isPaymentGateway) {
            showErrorToast({
                message: "Payment not available in your country",
                description: "Sorry, our payment gateway does not currently support transactions from your country. Please contact our team if you’d like to explore alternative purchase options.",
            });
            return;
        }

        try {
            const orderItems: CheckoutOrderItemReq[] = [];
            const orderItem = new CheckoutOrderItemReq({
                productType: ProductType.PLAN,
                priceId: pricedPlan.price.id,
                quantity: 1,
            });
            orderItems.push(orderItem);

            // Navigate to Checkout page with order items(only one plan)
            this.navigate("/billing/checkout", {
                state: { orderItems: orderItems.map(i => i.toJson()) }
            });
        }
        catch (error) {
            console.error("Error during checkout:", error);
            const appError = AppError.fromAny(error);
            throw appError;
        }
    }



    // handleCheckoutPlanRes(res: CreatePlanOrderRes) {
    //     const pgOrderData = res.pgOrderData as RzpOrderData;
    //     var options = {
    //         key: pgOrderData.rzpKey,
    //         order_id: pgOrderData.rzpOrderId,
    //         method: {
    //             card: true,
    //             upi: true,
    //             netbanking: true,
    //             emi: false,
    //             paylater: false
    //         },
    //         handler: (response: JsonObj) => {
    //             this.handleCheckoutSuccess(response);
    //         }
    //     };

    //     var rzp1 = new Razorpay(options);

    //     rzp1.on('payment.failed', function (response) {
    //         alert("Payment Failed!");
    //         alert("Error: " + response.error.description);
    //     });

    //     rzp1.open();
    // }


    // async handleCheckoutSuccess(response: JsonObj) {
    //     try {
    //         const successRes = RazorPayPaymentSuccess.fromRazorpayJson(response);
    //         const req = new PaymentSuccessReq({
    //             razorpayPaymentSuccessResponse: successRes,
    //         });
    //         const res = (await this.billingService.paymentSuccess(req)).getOrError();
    //         console.log("Payment success:", res);
    //     }
    //     catch (error) {
    //         const appError = AppError.fromAny(error);
    //         console.error("Error during payment success handling:", appError);
    //         throw appError;
    //     }
    // }


}

