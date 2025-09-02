import { action, makeObservable, observable, reaction } from "mobx";
import { AssmntDomain } from "~/domain/forms/models/AssmntDomain";
import { FormType } from "~/domain/forms/models/FormType";
import { Language } from "~/domain/forms/models/Language";
import { FormsSTTResType } from "~/domain/forms/stt/FormsSTTRes";
import { InputValue } from "~/ui/widgets/form/InputValue";


export type FormsSTTOptionsProps = {
    isRespondent: boolean;
    formId: number;
    language: Language;
    languages: Language[];
    type: FormsSTTResType;
}

export class FormsSTTOptions {
    isRespondent: boolean;
    formId: number;
    language: Language;
    languageField: InputValue<string>;
    languages: Language[];
    type: FormsSTTResType;

    constructor(params: FormsSTTOptionsProps) {
        this.isRespondent = params.isRespondent;
        this.formId = params.formId;
        this.language = params.language;
        this.languageField = new InputValue<string>(params.language.id);
        this.languages = params.languages;
        this.type = params.type;

        reaction(
            () => this.languageField.value, 
            (value) => this.onLanguageFieldChange(value)
        );

        makeObservable(this, {
            language: observable.ref,
            onLanguageFieldChange: action,
        });
    }

    get isLaTeX(): boolean {
        return this.type === FormsSTTResType.LATEX;
    }

    get isDoc(): boolean {
        return this.type === FormsSTTResType.DOC;
    }

    onLanguageFieldChange(value: string): void {
        const lang = this.languages.find(l => l.id === value);
        if (lang) {
            this.language = lang;
        }
    }

}


export type FormsSTTLaTexOptionsProps = Omit<FormsSTTOptionsProps, "type">;


export class FormsSTTLaTexOptions extends FormsSTTOptions {
    constructor(params: FormsSTTLaTexOptionsProps) {
        super({ ...params, type: FormsSTTResType.LATEX });
    }
}

export type FormsSTTDocOptionsProps = Omit<FormsSTTOptionsProps, "type"> & {
    formType: FormType;
    assmntDomain: AssmntDomain | null;
    aiAllowed: boolean;
    aiEnabled: boolean;
    isMultiline: boolean;
};

export class FormsSTTDocOptions extends FormsSTTOptions {


    formType: FormType;
    assmntDomain: AssmntDomain | null;
    aiAllowed: boolean;
    aiEnabled: boolean;
    isMultiline: boolean;

    constructor(params: FormsSTTDocOptionsProps) {
        super({ ...params, type: FormsSTTResType.DOC });
        this.formType = params.formType;
        this.assmntDomain = params.assmntDomain;
        this.aiAllowed = params.aiAllowed;
        this.aiEnabled = params.aiEnabled;
        this.isMultiline = params.isMultiline;
        makeObservable(this, {
            aiEnabled: observable,
            toggleAiEnabled: action,
        });
    }

    toggleAiEnabled(): void {
        this.aiEnabled = !this.aiEnabled;
    }

    static duplicate({ source, isMultiline }: { source: FormsSTTDocOptions, isMultiline: boolean }): FormsSTTDocOptions {
        return new FormsSTTDocOptions({
            isRespondent: source.isRespondent,
            formId: source.formId,
            language: source.language,
            languages: source.languages,
            formType: source.formType,
            assmntDomain: source.assmntDomain,
            aiAllowed: source.aiAllowed,
            aiEnabled: source.aiEnabled,
            isMultiline: isMultiline,
        });
    }


}