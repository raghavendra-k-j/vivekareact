import { JsonObj } from "~/core/types/Json";
import { BillingInterval } from "~/domain/common/models/BillingInterval";
import { Currency } from "~/domain/common/models/Currency";
import { PricedPlan } from "./PricedPlan";
import { PaymentProcessor } from "../../common/models/PaymentProcessor";

export type BillingIntervalPlansProps = {
    billingInterval: BillingInterval;
    pricedPlans: PricedPlan[];
}

export class BillingIntervalPlans {
    readonly billingInterval: BillingInterval;
    readonly pricedPlans: PricedPlan[];

    constructor(props: BillingIntervalPlansProps) {
        this.billingInterval = props.billingInterval;
        this.pricedPlans = props.pricedPlans;
    }

    static fromJson(json: JsonObj): BillingIntervalPlans {
        return new BillingIntervalPlans({
            billingInterval: BillingInterval.fromValue(json.billingInterval),
            pricedPlans: json.pricedPlans.map((planJson: JsonObj) => PricedPlan.fromJson(planJson)),
        });
    }
}

export type PlansListingResProps = {
    currency: Currency;
    paymentProcessor: PaymentProcessor | null;
    billingIntervalPlans: BillingIntervalPlans[];
}

export class PlansListingRes {

    readonly currency: Currency;
    readonly paymentProcessor: PaymentProcessor | null;
    readonly billingIntervalPlans: BillingIntervalPlans[];

    constructor(props: PlansListingResProps) {
        this.currency = props.currency;
        this.paymentProcessor = props.paymentProcessor;
        this.billingIntervalPlans = props.billingIntervalPlans;
    }

    static fromJson(json: JsonObj): PlansListingRes {
        return new PlansListingRes({
            currency: Currency.fromJson(json.currency),
            paymentProcessor: json.paymentProcessor ? PaymentProcessor.fromValue(json.paymentProcessor) : null,
            billingIntervalPlans: json.billingIntervalPlans.map((bipJson: JsonObj) => BillingIntervalPlans.fromJson(bipJson)),
        });
    }

}