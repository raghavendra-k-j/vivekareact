import { logger } from "~/core/utils/logger";
import { FormsSTTDialogStore } from "../FormSTTDialogStore";
import { DocSTTResVm } from "./DocSTTResVm";
import { LaTexSTTResVm } from "./LaTexSTTResVm";
import { STTResVm } from "./STTResVm";
import { DocSTTRes, FormsSTTRes, LatexSTTRes } from "~/domain/forms/stt/FormsSTTRes";

export abstract class STTResVmFactory {
    

    static empty(store: FormsSTTDialogStore): STTResVm {
        logger.debug("STTResVmFactory.empty called with store:", store.options);
        if (store.isLaTex) {
            return new LaTexSTTResVm();
        }
        else if (store.isDoc) {
            return new DocSTTResVm({
                isMultiline: store.docOptions.isMultiline,
            });
        }
        else {
            throw new Error("Unsupported STTResVm type");
        }
    }

    static toFormsSTTRes(resVm: STTResVm): FormsSTTRes {
        if(resVm instanceof DocSTTResVm) {
            const docResVm = resVm as DocSTTResVm;
            const docRes = new DocSTTRes(docResVm.paragraphs);
            return docRes;
        }
        else if(resVm instanceof LaTexSTTResVm) {
            const latexResVm = resVm as LaTexSTTResVm;
            const latexRes = new LatexSTTRes(latexResVm.latex);
            return latexRes;
        }
        else {
            throw new Error("Unsupported STTResVm type");
        }
    }


}