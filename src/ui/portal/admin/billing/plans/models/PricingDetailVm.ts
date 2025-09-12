import { PaymentProcessor } from "~/domain/billing/common/models/PaymentProcessor";
import { BillingIntervalPlans, PlansListingRes } from "~/domain/billing/pricing/models/PlansListingRes";
import { Currency } from "~/domain/common/models/Currency";

export type PricingDetailVmProps = {
    currency: Currency;
    paymentProcessor: PaymentProcessor | null;
    billingIntervalPlans: BillingIntervalPlans[];
}

export class PlansPageVm {

    currency: Currency;
    paymentProcessor: PaymentProcessor | null;
    billingIntervalPlans: BillingIntervalPlans[];

    constructor(props: PricingDetailVmProps) {
        this.currency = props.currency;
        this.paymentProcessor = props.paymentProcessor;
        this.billingIntervalPlans = props.billingIntervalPlans;
    }

    static fromModel(pd: PlansListingRes): PlansPageVm {
        return new PlansPageVm({
            currency: pd.currency,
            paymentProcessor: pd.paymentProcessor,
            billingIntervalPlans: pd.billingIntervalPlans,
        });
    }
}