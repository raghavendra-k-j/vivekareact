import { makeObservable, observable, runInAction } from "mobx";
import { CurrentFragment } from "./models/CurrentFragment";

export class HomePageStore {
    currentFragment: CurrentFragment = CurrentFragment.COURSES;

    constructor() {
        makeObservable(this, {
            currentFragment: observable.ref,
        });
    }

    get hasCourses() {
        return true;
    }

    get hasForms() {
        return true;
    }

    setCurrentFragment(fragment: CurrentFragment) {
        runInAction(() => {
            this.currentFragment = fragment;
        });
    }


}