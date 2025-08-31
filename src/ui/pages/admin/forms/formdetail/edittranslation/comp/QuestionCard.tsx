import clsx from "clsx";
import { QuestionVm } from "../models/QuestionVm";
import { Observer } from "mobx-react-lite";

export type QuestionCardProps = {
    children: React.ReactNode;
    vm: QuestionVm;
}

export function QuestionCard({ children, vm }: QuestionCardProps) {
    return (
        <Observer>
            {() => {
                const classList: string[] = ["bg-surface"];
                if (!vm.isSubQuestion) {
                    classList.push("rounded-sm");
                    classList.push("shadow-sm");
                }

                if (vm.isEdit) {
                    classList.push("border");
                    if (vm.hasError) {
                        classList.push("border-red-500");
                    }
                    else {
                        classList.push("border-primary");
                    }
                    if (!vm.isSubQuestion) {
                        classList.push("shadow-xl");
                    }
                }
                else {
                    if (!vm.isSubQuestion) {
                        classList.push("border")
                        classList.push("border-default");
                    }
                }

                classList.push(vm.type.isGroup ? "pt-4" : "py-4");

                const className = clsx(...classList);

                return (
                    <div className={className}>
                        {children}
                    </div>
                );
            }}
        </Observer>
    );
}
