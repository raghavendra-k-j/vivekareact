import { FormTranslationQuestion } from "~/domain/forms/admin/models/translation/FormTranslationQuestion";
import { QuestionVm, QuestionVmProps } from "./QuestionVm";
import { EditTranslationStore } from "../EditTranslationStore";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { Answer, PairMatchAnswer } from "~/domain/forms/models/answer/Answer";
import { PairMatchItem, PairMatchQExtras, QExtras } from "~/domain/forms/models/question/QExtras";
import { PairMatchQuestionView } from "../comp/PairMatchQuestionView";
import { StrUtils } from "~/core/utils/StrUtils";
import { FormQuestionConst } from "~/domain/forms/const/FormQuestionConst";

export type PairMatchQuestionVmProps = QuestionVmProps;

export type CreatePairMatchQuestionVmProps = {
    question: FormTranslationQuestion;
    storeRef: EditTranslationStore;
};

export class PairMatchQuestionVm extends QuestionVm {
    readonly items: PairMatchItemVm[];

    constructor(props: PairMatchQuestionVmProps) {
        super(props);
        this.items = this.buildItems(props.question);
    }

    private buildItems(question: FormTranslationQuestion): PairMatchItemVm[] {
        if (!question.type.isPairMatch) {
            throw new Error("Unsupported question type for PairMatchQuestionVm");
        }

        const qExtras = question.qExtras as PairMatchQExtras;
        const answer = question.answer as PairMatchAnswer;

        if (!qExtras || !answer) return [];

        const answerMap = answer.toIdMap();

        return qExtras.items.map(({ rowId, colAText, colBText }) =>
            PairMatchItemVm.fromText(rowId, colAText, colBText, answerMap[rowId])
        );
    }

    public validateAndGetQExtras(): QExtras | null | false {
        // return this.qExtras;
        const items: PairMatchItem[] = [];
        for (const item of this.items) {
            if (item.hasError) {
                return false;
            }
            const colAText = StrUtils.trimToNull(item.colAField.value);
            const colBText = StrUtils.trimToNull(item.colBField.value);

            const pairMatchItem = new PairMatchItem({
                rowId: item.id,
                colAText: colAText!,
                colBText: colBText!,
            });
            items.push(pairMatchItem);
        }

        if (items.length < FormQuestionConst.pairMatchMinPairs) {
            return false;
        }

        const qExtras = new PairMatchQExtras({
            items: items,
        });

        return qExtras;
    }

    public validateAndGetAnswer(): Answer | null | false {
        return this.answer;
    }

    static create({ question, storeRef }: CreatePairMatchQuestionVmProps): PairMatchQuestionVm {
        return new PairMatchQuestionVm({ question, storeRef });
    }

    render(): React.ReactNode {
        return <PairMatchQuestionView vm={this} />;
    }
}

export type PairMatchItemVmProps = {
    id: number;
    colAText: string;
    colBText: string;
    correctId: number;
};

export class PairMatchItemVm {
    readonly id: number;
    readonly colAField: InputValue<string>;
    readonly colBField: InputValue<string>;
    readonly correctId: number;

    get hasError(): boolean {
        return this.colAField.hasError || this.colBField.hasError;
    }

    constructor({ id, colAText, colBText, correctId }: PairMatchItemVmProps) {
        this.id = id;
        this.correctId = correctId;

        this.colAField = new InputValue<string>(colAText, {
            validator: this.buildValidator("Column A")
        });

        this.colBField = new InputValue<string>(colBText, {
            validator: this.buildValidator("Column B")
        });
    }

    private buildValidator(label: string) {
        return (val: string) => {
            const text = StrUtils.trimToNull(val);

            if (text === null) {
                return `${label} cannot be empty`;
            }

            if (text.length > FormQuestionConst.pairMatchRowTextMaxLength) {
                return `${label} cannot exceed ${FormQuestionConst.pairMatchRowTextMaxLength} characters`;
            }

            return null;
        };
    }

    static fromText(id: number, colAText: string, colBText: string, correctId: number): PairMatchItemVm {
        return new PairMatchItemVm({ id, colAText, colBText, correctId });
    }
}
