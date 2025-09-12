import { AssmntDomain } from "~/domain/forms/models/AssmntDomain";
import { FormType } from "~/domain/forms/models/FormType";
import { Language } from "~/domain/forms/models/Language";
import { FormsComposerOptions } from "~/ui/components/formscomposer/FormsComposerEditor";
import { FormsSTTDocOptions, FormsSTTLaTexOptions } from "~/ui/components/formssttdialog/models/FormatSTTOptions";


export interface FormsComposerOptionsData {
    latexSTTOptions: FormsSTTLaTexOptions;
    blockSTTOptions: FormsSTTDocOptions;
    inlineSTTOptions: FormsSTTDocOptions;
    blockComposerOptions: FormsComposerOptions;
    inlineComposerOptions: FormsComposerOptions;
};


export type FormsComposerOptionsDataInput = {
    formId: number;
    language: Language;
    languages: Language[];
    formType: FormType;
    assmntDomain: AssmntDomain | null;
    allowAiSTTFormat: boolean;
}

export class FormsComposerOptionsUtil {


    static create(input: FormsComposerOptionsDataInput): FormsComposerOptionsData {
        const { formId, language, languages, formType, assmntDomain, allowAiSTTFormat } = input;
        const isMathOrScience = assmntDomain?.isMathOrScience ?? false;
        const isAiSTTFormatAllowed = allowAiSTTFormat && isMathOrScience;

        const blockSTTOptions = new FormsSTTDocOptions({
            isRespondent: true,
            formType: formType,
            assmntDomain: assmntDomain,
            aiAllowed: isAiSTTFormatAllowed,
            aiEnabled: isAiSTTFormatAllowed,
            isMultiline: true,
            formId: formId,
            language: language,
            languages: languages,
        });

        const inlineSTTOptions = FormsSTTDocOptions.duplicate({
            source: blockSTTOptions,
            isMultiline: false,
        });

        const latexSTTOptions = new FormsSTTLaTexOptions({
            isRespondent: true,
            formId: formId,
            language: language,
            languages: languages,
        });

        const blockComposerOptions = {
            equation: {
                enabled: isMathOrScience,
                enableStt: isAiSTTFormatAllowed ? true : false,
                sttOptions: latexSTTOptions,
            },
            dictate: {
                enabled: true,
                sttOptions: blockSTTOptions,
            }
        };

        const inlineComposerOptions = {
            equation: {
                enabled: isMathOrScience,
                enableStt: isAiSTTFormatAllowed,
                sttOptions: latexSTTOptions,
            },
            dictate: {
                enabled: true,
                sttOptions: inlineSTTOptions,
            }
        };

        return {
            latexSTTOptions,
            blockSTTOptions,
            inlineSTTOptions,
            blockComposerOptions,
            inlineComposerOptions
        };
    }



}