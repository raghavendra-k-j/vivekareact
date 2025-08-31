import { AssmntDomain } from "../models/AssmntDomain";
import { FormType } from "../models/FormType";
import { FormsSTTRes, FormsSTTResType } from "./FormsSTTRes";

export type STTFormattingReqProps = {
    resType: FormsSTTResType,
    transcription: string;
    context: string;
    language: string;
    isRespondent: boolean;
    formType: FormType | null;
    assmntDomain: AssmntDomain | null;
}

export class STTFormattingReq {
    public transcription: string;
    public context: string;
    public resType: FormsSTTResType;
    public language: string;
    public isRespondent: boolean;
    public formType: FormType | null;
    public assmntDomain: AssmntDomain | null;

    constructor(props: STTFormattingReqProps) {
        this.transcription = props.transcription;
        this.context = props.context;
        this.resType = props.resType;
        this.language = props.language;
        this.isRespondent = props.isRespondent;
        this.formType = props.formType;
        this.assmntDomain = props.assmntDomain;
    }
}

export type STTFormattingResProps = {
    result: FormsSTTRes;
}

export class STTFormattingRes {
    
    public result: FormsSTTRes;

    constructor(props: STTFormattingResProps) {
        this.result = props.result;
    }

}