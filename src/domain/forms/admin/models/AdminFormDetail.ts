import { JsonObj } from "~/core/types/Json";
import { AssmntType } from "../../models/AssmntType";
import { FormStatus } from "../../models/FormStatus";
import { FormUser } from "../../models/FormUser";
import { FormVisibility } from "../../models/FormVisibility";
import { Language } from "../../models/Language";
import { AssmntTypeRefItem } from "./AssmntTypeRefItem";
import { FormType } from "../../models/FormType";
import { AssmntDomain } from "../../models/AssmntDomain";


export type AdminFormDetailProps = {
    id: number;
    type: FormType;
    permalink: string;
    orgId: number;
    shortLink: string;
    creator: FormUser;
    updatedBy: FormUser;
    createdAt: Date;
    updatedAt: Date;
    status: FormStatus;
    language: Language | null;
    languages: Language[];
    verifyGuestEmail: boolean | null;
    title: string;
    description: string | null;
    tags: string[];
    startDate: Date | null;
    endDate: Date | null;
    timeLimit: number | null;
    totalQuestions: number;
    totalMarks: number | null;
    passingMarks: number | null;
    assessmentType: AssmntType | null;
    assmntTypeRef: AssmntTypeRefItem | null;
    assmntDomain: AssmntDomain | null;
    shuffle: boolean | null;
    visibility: FormVisibility;
    hold4ManualEval: boolean | null;
    evalOeQsWtAi: boolean | null;

    totalViews: number;
    totalInvites: number;
    totalResponses: number;
}


export class AdminFormDetail {

    public readonly id: number;
    public readonly type: FormType;
    public readonly permalink: string;
    public readonly orgId: number;
    public readonly shortLink: string;
    public readonly creator: FormUser;
    public readonly updatedBy: FormUser;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly status: FormStatus;
    public readonly language: Language | null;
    public readonly languages: Language[];
    public readonly verifyGuestEmail: boolean | null;
    public readonly title: string;
    public readonly description: string | null;
    public readonly tags: string[];
    public readonly startDate: Date | null;
    public readonly endDate: Date | null;
    public readonly timeLimit: number | null;
    public readonly totalQuestions: number;
    public readonly totalMarks: number | null;
    public readonly passingMarks: number | null;
    public readonly assessmentType: AssmntType | null;
    public readonly assmntTypeRef: AssmntTypeRefItem | null;
    public readonly assmntDomain: AssmntDomain | null;
    public readonly shuffle: boolean | null;
    public readonly visibility: FormVisibility;
    public readonly hold4ManualEval: boolean | null;
    public readonly evalOeQsWtAi: boolean | null;
    public readonly totalViews: number;
    public readonly totalInvites: number;
    public readonly totalResponses: number;



    constructor(props: AdminFormDetailProps) {
        this.id = props.id;
        this.type = props.type;
        this.permalink = props.permalink;
        this.orgId = props.orgId;
        this.shortLink = props.shortLink;
        this.creator = props.creator;
        this.updatedBy = props.updatedBy;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.status = props.status;
        this.language = props.language;
        this.languages = props.languages;
        this.verifyGuestEmail = props.verifyGuestEmail;
        this.title = props.title;
        this.description = props.description;
        this.tags = props.tags;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.timeLimit = props.timeLimit;
        this.totalQuestions = props.totalQuestions;
        this.totalMarks = props.totalMarks;
        this.passingMarks = props.passingMarks;
        this.assessmentType = props.assessmentType;
        this.assmntTypeRef = props.assmntTypeRef;
        this.assmntDomain = props.assmntDomain;
        this.shuffle = props.shuffle;
        this.visibility = props.visibility;
        this.hold4ManualEval = props.hold4ManualEval;
        this.evalOeQsWtAi = props.evalOeQsWtAi;

        this.totalViews = props.totalViews;
        this.totalInvites = props.totalInvites;
        this.totalResponses = props.totalResponses;
    }

    isPublishedOrActive(): boolean {
        if (this.status !== FormStatus.Published) return false;
        if (this.startDate && this.endDate) {
            const now = new Date();
            return now > this.startDate && now < this.endDate;
        }
        return true;
    }


    static fromMap(map: JsonObj): AdminFormDetail {
        const formType = FormType.fromType(map.type)!;
        const creator = FormUser.fromJson(map.creator);
        const updatedBy = FormUser.fromJson(map.updatedBy);
        const createdAt = new Date(map.createdAt);
        const updatedAt = new Date(map.updatedAt);
        const status = FormStatus.fromValue(map.status);
        const language = map.language ? Language.fromJson(map.language) : null;
        const languages = map.languages ? map.languages.map((lang: JsonObj) => Language.fromJson(lang)) : [];
        const startDate = map.startDate ? new Date(map.startDate) : null;
        const endDate = map.endDate ? new Date(map.endDate) : null;
        const assessmentType = map.assessmentType ? AssmntType.fromType(map.assessmentType) || null : null;
        const assmntTypeRef = map.assmntTypeRef ? AssmntTypeRefItem.fromJson(map.assmntTypeRef) || null : null;
        const visibility = FormVisibility.fromVisibility(map.visibility)!;
        const assmntDomain = map.assmntDomain ? AssmntDomain.fromType(map.assmntDomain) : null;

        return new AdminFormDetail({
            id: map.id,
            type: formType,
            permalink: map.permalink,
            orgId: map.orgId,
            shortLink: map.shortLink,
            creator,
            updatedBy,
            createdAt,
            updatedAt,
            status,
            language,
            languages,
            verifyGuestEmail: map.verifyGuestEmail ?? null,
            title: map.title,
            description: map.description ?? null,
            tags: map.tags ?? [],
            startDate,
            endDate,
            timeLimit: map.timeLimit ?? null,
            totalQuestions: map.totalQuestions,
            totalMarks: map.totalMarks ?? null,
            passingMarks: map.passingMarks ?? null,
            assessmentType,
            assmntTypeRef,
            assmntDomain: assmntDomain,
            shuffle: map.shuffle ?? null,
            visibility,
            hold4ManualEval: map.hold4ManualEval ?? null,
            evalOeQsWtAi: map.evalOeQsWtAi ?? null,
            totalViews: map.totalViews,
            totalInvites: map.totalInvites,
            totalResponses: map.totalResponses,
        });
    }

}