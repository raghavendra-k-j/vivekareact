import { JsonObj } from "~/core/types/Json";

export enum SpanType {
    TEXT = "TEXT",
    LATEX = "LATEX"
}

export class Span {
    type: SpanType;
    content: string;

    constructor(type: SpanType, content: string) {
        this.type = type;
        this.content = content;
    }

    static fromJson(json: JsonObj): Span {
        const type = json.type === "LATEX" ? SpanType.LATEX : SpanType.TEXT;
        return new Span(
            type,
            json.content
        );
    }
}


export class Paragraph {
    spans: Span[];

    constructor(spans: Span[]) {
        this.spans = spans;
    }

    static fromJson(json: JsonObj): Paragraph {
        const spans = json.spans.map((span: JsonObj) => Span.fromJson(span));
        return new Paragraph(spans);
    }
}



export type AiFormatReqProps = {
    formId: number;
    language: string;
    isRespondent: boolean;
    text: string;
};

export class AiFormatReq {

    formId: number;
    language: string;
    isRespondent: boolean;
    text: string;

    constructor(props: AiFormatReqProps) {
        this.formId = props.formId;
        this.language = props.language;
        this.isRespondent = props.isRespondent;
        this.text = props.text;
    }


    toRequestBody(): JsonObj {
        return {
            formId: this.formId,
            language: this.language,
            isRespondent: this.isRespondent,
            text: this.text
        };
    }
}


export type AiFormatResProps = {
    paragraphs: Paragraph[];
};


export class AiFormatRes {

    paragraphs: Paragraph[];

    constructor(props: AiFormatResProps) {
        this.paragraphs = props.paragraphs;
    }

    static fromJson(json: JsonObj): AiFormatRes {
        const paragraphs = json.paragraphs.map((p: JsonObj) => Paragraph.fromJson(p));
        return new AiFormatRes({ paragraphs });
    }
}

