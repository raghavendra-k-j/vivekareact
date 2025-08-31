import { JsonObj } from "~/core/types/Json";
import { GuestBase } from "~/domain/common/models/GuestBase";
import { NumChangeMetric } from "~/domain/common/models/NumChangeMetric";
import { UserBase } from "~/domain/common/models/UserBase";

type FormCompareUserItemDetailProps = {
    marks: number;
    percentage: number;
    timeTaken: number;
    passed: boolean | null;
}

export class FormCompareUserItemDetail {
    marks: number;
    percentage: number;
    timeTaken: number;
    passed: boolean | null;

    constructor(props: FormCompareUserItemDetailProps) {
        this.marks = props.marks;
        this.percentage = props.percentage;
        this.timeTaken = props.timeTaken;
        this.passed = props.passed;
    }

    static fromJson(json: JsonObj): FormCompareUserItemDetail {
        return new FormCompareUserItemDetail({
            marks: json.marks,
            percentage: json.percentage,
            timeTaken: json.timeTaken,
            passed: json.passed
        });
    }
}


export type FormCompareUserItemProps = {
    userTile: UserBase | null;
    guestTile: GuestBase | null;
    formA: FormCompareUserItemDetail;
    formB: FormCompareUserItemDetail;
}

export class FormCompareUserItem {
    userTile: UserBase | null;
    guestTile: GuestBase | null;

    formA: FormCompareUserItemDetail;
    formB: FormCompareUserItemDetail;
    participantKey: string;
    marksChange: NumChangeMetric;
    percentageChange: NumChangeMetric;
    timeTakenChange: NumChangeMetric;

    constructor(props: FormCompareUserItemProps) {
        this.userTile = props.userTile;
        this.guestTile = props.guestTile;

        this.formA = props.formA;
        this.formB = props.formB;
        this.participantKey = props.userTile ? String(props.userTile.id) : "guest_" + String(props.guestTile!.id);

        this.marksChange = NumChangeMetric.calculateChange(props.formA.marks, props.formB.marks);
        this.percentageChange = NumChangeMetric.calculateChange(props.formA.percentage, props.formB.percentage);
        this.timeTakenChange = NumChangeMetric.calculateChange(props.formA.timeTaken, props.formB.timeTaken);
    }

    static fromJson(json: JsonObj): FormCompareUserItem {
        return new FormCompareUserItem({
            userTile: json.userTile ? UserBase.fromJson(json.userTile) : null,
            guestTile: json.guestTile ? GuestBase.fromJson(json.guestTile) : null,
            formA: FormCompareUserItemDetail.fromJson(json.formA),
            formB: FormCompareUserItemDetail.fromJson(json.formB)
        });
    }
}