import type { JsonObj } from "~/core/types/Json";
import { QExtras } from "./QExtras";
import { QuestionLevel } from "./QuestionLevel";
import { QuestionType } from "./QuestionType";
import { Bool3 } from "~/core/utils/Bool3";
import { QMedia } from "../qmedia/QMedia";
import { QMediaTile } from "../qmedia/QMediaTile";


type QuestionProps = {
    id: number;
    parentId: number | null;
    dOrder: number;
    type: QuestionType;
    question: string;
    qExtras: QExtras | null;
    ansHint: string | null;
    level: QuestionLevel | null;
    marks: number | null;
    mediaFiles: QMediaTile[];
    isRequired: Bool3;
    subQuestions: Question[] | null;
}


export class Question {
    id: number;
    parentId: number | null;
    dOrder: number;
    type: QuestionType;
    question: string;
    qExtras: QExtras | null;
    ansHint: string | null;
    level: QuestionLevel | null;
    marks: number | null;
    mediaFiles: QMediaTile[];
    isRequired: Bool3;
    subQuestions: Question[] | null;

    constructor(props: QuestionProps) {
        this.id = props.id;
        this.parentId = props.parentId;
        this.dOrder = props.dOrder;
        this.type = props.type;
        this.question = props.question;
        this.qExtras = props.qExtras;
        this.ansHint = props.ansHint;
        this.level = props.level;
        this.marks = props.marks;
        this.mediaFiles = props.mediaFiles;
        this.isRequired = props.isRequired;
        this.subQuestions = props.subQuestions;
    }


    static fromJson(json: JsonObj): Question {
        const type = QuestionType.fromType(json.type)!;
        const qExtras = json.qExtras ? QExtras.fromTypeAndMap(type, json.qExtras) : null;

        const subQuestions = json.subQuestions
            ? json.subQuestions.map((subJson: JsonObj) => Question.fromJson(subJson))
            : null;

        const level = QuestionLevel.fromLevel(json.level);

        const mediaFiles = json.mediaFiles
            ? json.mediaFiles.map((mediaJson: JsonObj) => QMedia.fromJson(mediaJson))
            : null;

        return new Question({
            id: json.id,
            parentId: json.parentId,
            dOrder: json.dOrder,
            type: type,
            question: json.question,
            qExtras: qExtras,
            ansHint: json.ansHint,
            level: level,
            marks: json.marks,
            mediaFiles: mediaFiles,
            isRequired: Bool3.bool(json.isRequired),
            subQuestions: subQuestions,
        });
    }
}