import { makeObservable, observable, reaction, runInAction } from "mobx";
import { SingleValue } from "react-select";
import { BillingAddress } from "~/domain/billing/common/models/BillingAddress";
import { Subdivision } from "~/domain/common/models/Subdivision";
import { FValue } from "~/ui/widgets/form/FValue";
import { CheckoutPageStore } from "../CheckoutPageStore";

export class BillingAddressFormVm {


    checkoutStore: CheckoutPageStore;

    fullNameField = new FValue<string>("");
    emailField = new FValue<string>("");
    mobileField = new FValue<string>("");
    line1Field = new FValue<string>("");
    line2Field = new FValue<string>("");
    cityField = new FValue<string>("");
    postalCodeField = new FValue<string>("");
    countryField = new FValue<string>("");
    companyNameField = new FValue<string>("");
    companyTaxIdField = new FValue<string>("");

    subdivision: Subdivision | null = null;
    subdivisionField = new FValue<string>("");
    isBusiness: boolean = false;

    constructor({ checkoutStore }: { checkoutStore: CheckoutPageStore }) {
        this.checkoutStore = checkoutStore;
        makeObservable(this, {
            isBusiness: observable,
            subdivision: observable.ref,
        });
        this.addValidations();
        this.setupReactions();
    }


    setupReactions() {
        reaction(() => this.cityField.value, () => {
            this.checkoutStore.triggerCheckoutSummary();
        });
        reaction(() => this.subdivisionField.value, () => {
            this.checkoutStore.triggerCheckoutSummary();
        });
        reaction(() => this.postalCodeField.value, () => {
            this.checkoutStore.triggerCheckoutSummary();
        });
        reaction(() => this.subdivision, () => {
            this.checkoutStore.triggerCheckoutSummary();
        });
    }

    addValidations() {

    }

    update(billingAddress: BillingAddress) {
        if (billingAddress.fullName != null) this.fullNameField.set(billingAddress.fullName);
        this.emailField.set(billingAddress.email);
        this.mobileField.set(billingAddress.mobile);
        this.line1Field.set(billingAddress.line1);
        if (billingAddress.line2 != null) this.line2Field.set(billingAddress.line2);
        if (billingAddress.city != null) this.cityField.set(billingAddress.city);
        if (billingAddress.postalCode != null) this.postalCodeField.set(billingAddress.postalCode);
        if (this.pcd.country.metadata?.subdivisionInputType == "select") {
            if (this.pcd.subdivisions != null && this.pcd.subdivisions.length > 0) {
                this.onSubdivisionChange(this.pcd.subdivisions.find(s => s.id === billingAddress.subdivisionId) || null);
            }
        }
    }

    get pcd() {
        return this.checkoutStore.pcd;
    }


    onSubdivisionChange(v: SingleValue<Subdivision>): void {
        runInAction(() => {
            this.subdivision = v;
        });
    }

}