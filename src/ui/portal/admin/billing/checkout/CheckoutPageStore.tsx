import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { JsonObj } from "~/core/types/Json";
import { BillingAddress } from "~/domain/billing/common/models/BillingAddress";
import { CheckoutSummaryReq } from "~/domain/billing/common/models/CalcCheckoutAmountReq";
import { CheckoutOrderItem } from "~/domain/billing/common/models/CheckoutOrderItem";
import { CheckoutOrderItemReq } from "~/domain/billing/common/models/CheckoutOrderItemReq";
import { CheckoutRes } from "~/domain/billing/common/models/CheckoutRes";
import { CheckoutSummary } from "~/domain/billing/common/models/CheckoutSummary";
import { CheckoutReq } from "~/domain/billing/common/models/CreatePlanOrderReq";
import { PartyType } from "~/domain/billing/common/models/PartyType";
import { PreCheckoutData } from "~/domain/billing/common/models/PreCheckoutData";
import { PreCheckoutDataReq } from "~/domain/billing/common/models/PreCheckoutDataReq";
import { SaveBillingAddressReq } from "~/domain/billing/common/models/SaveBillingAddressReq";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { DataState } from "~/ui/utils/DataState";
import { BillingLayoutStore } from "../layout/BillingLayoutStore";
import { BillingAddressFormVm } from "./models/BillingAddressFormVm";

export type CheckoutPageStoreProps = {
    billingStore: BillingLayoutStore;
    orderItemsReq: CheckoutOrderItemReq[];
};

export class CheckoutPageStore {


    billingStore: BillingLayoutStore;
    orderItemsReq: CheckoutOrderItemReq[];

    pcdState: DataState<PreCheckoutData> = DataState.init();
    summaryState: DataState<CheckoutSummary> = DataState.init();
    _summary: CheckoutSummary | null = null;

    bafVm!: BillingAddressFormVm;

    payState: DataState<CheckoutRes> = DataState.init();


    constructor(props: CheckoutPageStoreProps) {
        this.billingStore = props.billingStore;
        this.orderItemsReq = props.orderItemsReq;
        this.bafVm = new BillingAddressFormVm({ checkoutStore: this });
        makeObservable(this, {
            pcdState: observable.ref,
            _summary: observable.ref,
            summaryState: observable.ref,
            payState: observable.ref,
        });
    }

    get pcd() {
        return this.pcdState.data!;
    }

    get summary() {
        return this._summary!;
    }

    get orderItems(): CheckoutOrderItem[] {
        return this.summary.items;
    }

    async loadPreCheckoutData() {
        try {
            runInAction(() => {
                this.pcdState = DataState.loading();
            });
            const req = new PreCheckoutDataReq({
                items: this.orderItemsReq,
            });
            const preCheckoutData = (await this.billingStore.billingService.getPreCheckoutData(req)).getOrError();
            runInAction(() => {
                this._summary = preCheckoutData.checkoutSummary;
                this.pcdState = DataState.data(preCheckoutData);
            });
            if (this.pcd.billingAddress != null) {
                this.bafVm.update(this.pcd.billingAddress);
            }
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.pcdState = DataState.error(appError);
            });
        }
    }

    async getCheckoutSummary() {
        try {
            runInAction(() => {
                this.summaryState = DataState.loading();
            });
            const billingAddress: JsonObj = {
                countryId: this.pcd.country.id,
                subdivisionId: this.bafVm.subdivision?.id
            };
            const req = new CheckoutSummaryReq({
                billingAddress: billingAddress,
                orderItems: this.orderItemsReq,
                includeItemDetails: false
            });
            const res = (await withMinDelay(this.billingStore.billingService.getCheckoutSummary(req), 500)).getOrError();
            runInAction(() => {
                this.summaryState = DataState.data(res);
                this._summary = res;
            });
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.summaryState = DataState.error(appError);
            });
        }
    }

    async triggerCheckoutSummary() {
        this.getCheckoutSummary();
    }

    async onClickPayNow(): Promise<void> {
        try {
            runInAction(() => {
                this.payState = DataState.loading();
            });
            const saveAddressReq = new SaveBillingAddressReq({
                partyType: PartyType.INDIVIDUAL,
                companyName: this.bafVm.companyNameField.value,
                fullName: this.bafVm.fullNameField.value,
                taxId: this.bafVm.companyTaxIdField.value,
                line1: this.bafVm.line1Field.value,
                line2: this.bafVm.line2Field.value,
                city: this.bafVm.cityField.value,
                subdivisionId: this.bafVm.subdivision?.id || null,
                subdivisionName: this.bafVm.subdivisionField.value,
                postalCode: this.bafVm.postalCodeField.value,
                countryId: this.pcd.country.id,
                email: this.bafVm.emailField.value,
                callingCode: "91",
                mobile: this.bafVm.mobileField.value,
            });
            const billingAddress = (await this.billingStore.billingService.saveBillingAddress(saveAddressReq)).getOrError();
            const checkoutReq = new CheckoutReq({
                orderItems: this.orderItemsReq,
                currencyCode: this.pcd.currency.code,
                billingAddressId: billingAddress.id
            });
            const checkoutRes = (await this.billingStore.billingService.checkout(checkoutReq)).getOrError();
            runInAction(() => {
                this.payState = DataState.data(checkoutRes);
                this.openRazorpay(billingAddress, checkoutRes);
            });
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.payState = DataState.error(appError);
            });
        }
    }

    async openRazorpay(billingAddress: BillingAddress, res: CheckoutRes) {
        var options = {
            "key": res.providerData.razorpayKey,
            "order_id": res.providerData.razorpayOrderId,
            "handler": function (_response: JsonObj) {
                
            },
            "prefill": {
                "name": billingAddress.fullName,
                "email": billingAddress.email,
                "contact": billingAddress.mobile
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
    }






}