import { AppError } from "~/core/error/AppError";
import { MyOrdersReq, MyOrdersRes } from "~/domain/billing/common/models/MyOrdersRes";
import { DataState } from "~/ui/utils/DataState";
import { BillingLayoutStore } from "../layout/BillingLayoutStore";
import { makeObservable, observable, runInAction } from "mobx";

export type PaymentsPageStoreProps = {
  parentStore: BillingLayoutStore;
}

export class PaymentsPageStore {

  parentStore: BillingLayoutStore;
  ordersState: DataState<MyOrdersRes> = DataState.init();

  constructor(props: PaymentsPageStoreProps) {
    this.parentStore = props.parentStore;
    makeObservable(this, {
      ordersState: observable.ref,
    });
  }

  get ordersRes(): MyOrdersRes {
    return this.ordersState.data!;
  }


  async loadOrders({ page }: { page: number; }): Promise<void> {
    try {
      runInAction(() => {
        this.ordersState = DataState.loading();
      });
      const req = new MyOrdersReq({
        page: page,
        pageSize: 10
      });
      const result = (await this.parentStore.billingService.getMyOrders(req)).getOrError();
      runInAction(() => {
        this.ordersState = DataState.data(result);
      });
    }
    catch (error) {
      const appError = AppError.fromAny(error);
      runInAction(() => {
        this.ordersState = DataState.error(appError);
      });
    }
  }


}
