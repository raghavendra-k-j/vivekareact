import { BillingService } from "~/domain/billing/common/services/BillingService";
import { AppStore } from "../../_layout/AppStore";

export type BillingLayoutStoreProps = {
    appStore: AppStore;
    showAppBar: boolean;
}

export class BillingLayoutStore {

    appStore: AppStore;
    billingService: BillingService;
    showAppBar: boolean;

    constructor(props: BillingLayoutStoreProps) {
        this.appStore = props.appStore;
        this.billingService = new BillingService();
        this.showAppBar = props.showAppBar;
    }

}