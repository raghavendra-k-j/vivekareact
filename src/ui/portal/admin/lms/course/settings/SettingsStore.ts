import { makeObservable } from "mobx";
import { CourseLayoutStore } from "../layout/CourseLayoutStore";

export class SettingsStore {
    layoutStore: CourseLayoutStore;

    constructor({ layoutStore }: { layoutStore: CourseLayoutStore }) {
        this.layoutStore = layoutStore;
        makeObservable(this, {
            // Add observable properties here
        });
    }

    // Add methods here
}