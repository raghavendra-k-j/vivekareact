import { AppStore } from "~/ui/portal/layout/app/AppStore";
import { BillingLayoutStore } from "../layout/BillingLayoutStore";

export type MyPlanPageProps = {
  parentStore: BillingLayoutStore;
}

export class MyPlanPageStore {

  parentStore: BillingLayoutStore;

  constructor(props: MyPlanPageProps) {
    this.parentStore = props.parentStore;
  }

  get appStore(): AppStore {
    return this.parentStore.appStore;
  }

  get plan() {
    return (this.appStore.orgConfig as any).plan;
  }

  get usage() {
    return (this.appStore.orgConfig as any).usage;
  }


}

