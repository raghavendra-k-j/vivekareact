import { JsonObj } from "~/core/types/Json";
import { Country } from "~/domain/common/models/Country";
import { BillingAddress } from "./BillingAddress";
import { CheckoutSummary } from "./CheckoutSummary";
import { Subdivision } from "~/domain/common/models/Subdivision";
import { Currency } from "~/domain/common/models/Currency";

export type PreCheckoutDataProps = {
    billingAddress: BillingAddress | null;
    country: Country;
    subdivisions: Subdivision[] | null;
    currency: Currency;
    readonly checkoutSummary: CheckoutSummary;
};

export class PreCheckoutData {

    readonly billingAddress: BillingAddress | null;
    readonly country: Country;
    readonly subdivisions: Subdivision[] | null;
    readonly currency: Currency;
    readonly checkoutSummary: CheckoutSummary;

    constructor(props: PreCheckoutDataProps) {
        this.billingAddress = props.billingAddress;
        this.country = props.country;
        this.subdivisions = props.subdivisions;
        this.currency = props.currency;
        this.checkoutSummary = props.checkoutSummary;
    }

    static fromJson(json: JsonObj): PreCheckoutData {
        return new PreCheckoutData({
            billingAddress: json.billingAddress ? BillingAddress.fromJson(json.billingAddress) : null,
            country: Country.fromJson(json.country),
            subdivisions: json.subdivisions ? json.subdivisions.map((item: JsonObj) => Subdivision.fromJson(item)) : null,
            currency: Currency.fromJson(json.currency),
            checkoutSummary: CheckoutSummary.fromJson(json.checkoutSummary),
        });
    }
}