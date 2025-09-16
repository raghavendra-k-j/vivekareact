import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { HomeLayoutData } from "~/domain/common/models/HomeLayout";
import { getHomeLayout } from "~/domain/common/services/home_services";
import { DataState } from "~/ui/utils/DataState";
import { RootLayoutStore } from "../../layout/root/RootLayoutStore";
import { CurrentFragment } from "./models/CurrentFragment";

export class HomeLayoutStore {

    rootLayoutStore: RootLayoutStore;
    currentFragment: CurrentFragment = CurrentFragment.COURSES;
    layoutDataState: DataState<HomeLayoutData> = DataState.init();

    constructor({ rootLayoutStore }: { rootLayoutStore: RootLayoutStore; }) {
        this.rootLayoutStore = rootLayoutStore;
        makeObservable(this, {
            currentFragment: observable.ref,
            layoutDataState: observable.ref,
        });
    }

    get homeLayout() {
        return this.layoutDataState.data!;
    }

    setCurrentFragment(fragment: CurrentFragment) {
        runInAction(() => {
            this.currentFragment = fragment;
        });
    }

    async loadLayout() {
        try {
            runInAction(() => {
                this.layoutDataState = DataState.loading();
            });
            const res = (await getHomeLayout()).getOrError();
            runInAction(() => {
                this.layoutDataState = DataState.data(res);
            });
        }
        catch (err) {
            const appError = AppError.fromAny(err);
            runInAction(() => {
                this.layoutDataState = DataState.error(appError);
            });
        }
    }


}