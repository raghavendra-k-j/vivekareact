import { action, makeObservable, observable } from "mobx";
import { STTResVm } from "./STTResVm";
import { logger } from "~/core/utils/logger";

export class LaTexSTTResVm extends STTResVm {


    latex: string;

    constructor() {
        super();
        this.latex = "";
        makeObservable(this, {
            latex: observable,
            replace: action,
        });
    }


    get isEmpty(): boolean {
        logger.debug("LaTexSTTResVm.isEmpty", this);
        logger.debug("LaTexSTTResVm.isEmpty.latex", this.latex);
        return this.latex.trim().length === 0;
    }

    replace(latex: string) {
        this.latex = latex;
    }

    isContentEmpty(): boolean {
        return this.isEmpty;
    }


}