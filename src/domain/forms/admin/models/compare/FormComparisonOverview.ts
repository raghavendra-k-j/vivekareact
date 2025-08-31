import { JsonObj } from "~/core/types/Json";
import { NumChangeMetric } from "~/domain/common/models/NumChangeMetric";

export type FormItemsProps = {
    label: string;
    avgMarks: number;
    avgPercent: number;
    avgTime: number;
    passRate: number | null;
    passCount: number | null;
}

export class FormItem {
    label: string;
    avgMarks: number;
    avgPercent: number;
    avgTime: number;
    passRate: number | null;
    passCount: number | null;

    constructor(props: FormItemsProps) {
        this.label = props.label;
        this.avgMarks = props.avgMarks;
        this.avgPercent = props.avgPercent;
        this.avgTime = props.avgTime;
        this.passRate = props.passRate;
        this.passCount = props.passCount;
    }

    static fromJson(json: JsonObj): FormItem {
        return new FormItem({
            label: json.label,
            avgMarks: json.avgMarks,
            avgPercent: json.avgPercent,
            avgTime: json.avgTime,
            passRate: json.passRate,
            passCount: json.passCount
        });
    }

}



export type FormComparisonOverviewProps = {
    formA: FormItem;
    formB: FormItem;
}

export class FormComparisonOverview {
    formA: FormItem;
    formB: FormItem;

    avgMarksChange: NumChangeMetric;
    avgPercentChange: NumChangeMetric;
    avgTimeChange: NumChangeMetric;

    passRateChange: NumChangeMetric | null;
    passCountChange: NumChangeMetric | null;

    constructor(props: FormComparisonOverviewProps) {
        this.formA = props.formA;
        this.formB = props.formB;

        this.avgMarksChange = NumChangeMetric.calculateChange(this.formA.avgMarks, this.formB.avgMarks);
        this.avgPercentChange = NumChangeMetric.calculateChange(this.formA.avgPercent, this.formB.avgPercent);
        this.avgTimeChange = NumChangeMetric.calculateChange(this.formA.avgTime, this.formB.avgTime);

        if (this.formA.passRate !== null && this.formB.passRate !== null) {
            this.passRateChange = NumChangeMetric.calculateChange(this.formA.passRate, this.formB.passRate);
            this.passCountChange = NumChangeMetric.calculateChange(this.formA.passCount!, this.formB.passCount!);
        } else {
            this.passRateChange = null;
            this.passCountChange = null;
        }
    }

    static fromJson(json: JsonObj): FormComparisonOverview {
        return new FormComparisonOverview({
            formA: FormItem.fromJson(json.formA),
            formB: FormItem.fromJson(json.formB)
        });
    }


}