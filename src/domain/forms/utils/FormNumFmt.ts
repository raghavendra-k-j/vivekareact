import { NumFmt } from "~/core/utils/NumFmt";

export class FormNumFmt {

    static formatMarks(marks: number): string {
        return NumFmt.roundToStr(marks, 2);
    }

    static formatPercentage(percentage: number): string {
        return NumFmt.roundToStr(percentage, 2);
    }
}