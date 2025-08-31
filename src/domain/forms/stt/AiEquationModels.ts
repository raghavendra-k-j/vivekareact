import { JsonObj } from "~/core/types/Json";

export type AiEquationReqProps = {
    text: string;
    formId: number;
    isRespondent: boolean;
    language: string;
}

export class AiEquationReq {
    public text: string;
    public formId: number;
    public isRespondent: boolean;
    public language: string;

    constructor(props: AiEquationReqProps) {
        this.text = props.text;
        this.formId = props.formId;
        this.isRespondent = props.isRespondent;
        this.language = props.language;
    }

    toRequestBody(): JsonObj {
        return {
            text: this.text,
            formId: this.formId,
            isRespondent: this.isRespondent,
            language: this.language,
        };
    }

}


export type AiEquationResProps = {
    latex: string;
}


export class AiEquationRes {
    public latex: string;

    constructor(props: AiEquationResProps) {
        this.latex = props.latex;
    }

    static fromJson(json: JsonObj): AiEquationRes {
        return new AiEquationRes({
            latex: json.latex,
        });
    }

}
