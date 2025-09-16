import { makeObservable } from "mobx";
import { CoursePageStore } from "../CoursePageStore";

export class SettingsStore {
    layoutStore: CoursePageStore;

    constructor({ layoutStore }: { layoutStore: CoursePageStore }) {
        this.layoutStore = layoutStore;
        makeObservable(this, {
            // Add observable properties here
        });
    }

    // Add methods here
}