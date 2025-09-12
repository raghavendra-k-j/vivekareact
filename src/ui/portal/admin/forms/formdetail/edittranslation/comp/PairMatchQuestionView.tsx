import { Observer } from "mobx-react-lite";
import { Input } from "~/ui/widgets/form/Input";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { PairMatchItemVm, PairMatchQuestionVm } from "../models/PairMatchQuestionVm";
import { QuestionCard } from "./QuestionCard";
import { QuestionFooter } from "./QuestionFooter";
import { QuestionHeader } from "./QuestionHeader";

export type PairMatchQuestionViewProps = {
    vm: PairMatchQuestionVm;
};

export function PairMatchQuestionView({ vm }: PairMatchQuestionViewProps) {
    return (
        <QuestionCard vm={vm}>
            <QuestionHeader vm={vm} />
            <div className="my-4 px-6">
                <Observer>
                    {() =>
                        vm.isEdit ? (
                            <EditPairMatchTable vm={vm} />
                        ) : (
                            <ReadPairMatchTable vm={vm} />
                        )
                    }
                </Observer>
            </div>
            <QuestionFooter vm={vm} />
        </QuestionCard>
    );
}

function EditPairMatchTable({ vm }: { vm: PairMatchQuestionVm }) {
    return (
        <table className="min-w-full datatable datatable-bordered">
            <TableHeader />
            <tbody>
                {vm.items.map((item) => (
                    <EditPairMatchRowItem key={item.id} item={item} />
                ))}
            </tbody>
        </table>
    );
}


type EditPairMatchRowItemProps = {
    item: PairMatchItemVm;
}

function EditPairMatchRowItem({ item }: EditPairMatchRowItemProps) {
    return (
        <tr>
            <td className="border border-default px-3 py-2 text-center w-10">{item.id}</td>
            <td className="px-3 py-2 border border-default">
                <PairMatchInput placeholder="Column A" field={item.colAField} />
            </td>
            <td className="px-3 py-2 border border-default">
                <PairMatchInput placeholder="Column B" field={item.colBField} />
            </td>
        </tr>
    );
}

function ReadPairMatchTable({ vm }: { vm: PairMatchQuestionVm }) {
    return (
        <table className="min-w-full datatable datatable-bordered">
            <TableHeader />
            <tbody>
                {vm.items.map((item) => (
                    <ReadPairMatchRowItem key={item.id} item={item} />
                ))}
            </tbody>
        </table>
    );
}


type ReadPairMatchRowItemProps = {
    item: PairMatchItemVm;
}

function ReadPairMatchRowItem(props: ReadPairMatchRowItemProps) {
    return (
        <tr>
            <td className="border border-default px-3 py-2 text-center w-10">{props.item.id}</td>
            <td className="px-3 py-2 border border-default text-base-m text-default">
                {props.item.colAField.value}
            </td>
            <td className="px-3 py-2 border border-default text-base-m text-default">
                {props.item.colBField.value}
            </td>
        </tr>
    );
}

function TableHeader() {
    const headers = ["#", "Column A", "Column B"];
    return (
        <thead className="datatable-head">
            <tr>
                {headers.map((title) => (
                    <th
                        key={title}
                        className="px-3 py-2 text-left text-xs font-medium"
                    >
                        {title}
                    </th>
                ))}
            </tr>
        </thead>
    );
}


type PairMatchInputProps = {
    placeholder: string;
    field: InputValue<string>;
};

const PairMatchInput = ({ placeholder, field }: PairMatchInputProps) => {
    return (
        <Observer>
            {() => (
                <div>
                    <Input
                        placeholder={placeholder}
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                    />
                    {field.error && (
                        <div className="mt-1 text-error text-xs">
                            {field.error}
                        </div>
                    )}
                </div>
            )}
        </Observer>
    );
};