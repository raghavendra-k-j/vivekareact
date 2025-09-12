import { makeObservable, observable, reaction, runInAction } from "mobx";
import { SingleValue } from "react-select";
import { BillingAddress } from "~/domain/billing/common/models/BillingAddress";
import { Subdivision } from "~/domain/common/models/Subdivision";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { CheckoutPageStore } from "../CheckoutPageStore";

export class BillingAddressFormVm {


    checkoutStore: CheckoutPageStore;

    fullNameField = new InputValue<string>("");
    emailField = new InputValue<string>("");
    mobileField = new InputValue<string>("");
    line1Field = new InputValue<string>("");
    line2Field = new InputValue<string>("");
    cityField = new InputValue<string>("");
    postalCodeField = new InputValue<string>("");
    countryField = new InputValue<string>("");
    companyNameField = new InputValue<string>("");
    companyTaxIdField = new InputValue<string>("");

    subdivision: Subdivision | null = null;
    subdivisionField = new InputValue<string>("");
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