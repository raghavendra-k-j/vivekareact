import { makeObservable, observable, runInAction } from "mobx";

export class UsersTableOption {
    showPassStatusColumn: boolean;
    showTimeTakenColumn: boolean;

    constructor() {
        this.showPassStatusColumn = true;
        this.showTimeTakenColumn = true;
        makeObservable(this, {
            showPassStatusColumn: observable,
            showTimeTakenColumn: observable,
        });
    }

    setShowPassStatusColumn = (value: boolean) => {
        runInAction(() => {
            this.showPassStatusColumn = value;
        });
    }

    setShowTimeTakenColumn = (value: boolean) => {
        runInAction(() => {
            this.showTimeTakenColumn = value;
        });
    }

    get wholeTableColSpan() {
        let colSpan = 4;
        if (this.showPassStatusColumn) {
            colSpan += 2;
        }
        if (this.showTimeTakenColumn) {
            colSpan += 2;
        }
        return colSpan;
    }

}