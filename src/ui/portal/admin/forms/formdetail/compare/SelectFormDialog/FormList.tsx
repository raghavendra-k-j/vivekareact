import React from "react";
import { FormCompareItemVm } from "../models/FormCompareItemVm";
import { useSelectFormDialogStore } from "./SelectFormDialogStore";
import { Observer } from "mobx-react-lite";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { Pagination } from "~/ui/widgets/pagination/Pagination";
import clsx from "clsx";
import OutlinedButton from "~/ui/widgets/button/OutlinedButton";
import { DateFmt } from "~/core/utils/DateFmt";
import { NumFmt } from "~/core/utils/NumFmt";
import { AdminFormStatusBadge } from "~/ui/components/form/commons/AdminFormStatusBadge";
import { AssmntTypeBadge } from "~/ui/components/form/commons/AssmntTypeBadge";

const CenteredContent = ({ children }: { children: React.ReactNode, }) => (
    <div className={clsx("p-6 flex justify-center items-center flex-1 overflow-y-auto")}>
        {children}
    </div>
);

export function FormListView() {
    const store = useSelectFormDialogStore();
    return (<Observer>
        {() => {
            return store.loadState.stateWhen({
                initOrLoading: () => (<CenteredContent><LoaderView /></CenteredContent>),
                error: (error) => (<CenteredContent><SimpleRetryableAppView onRetry={() => { store.loadData() }} appError={error} /></CenteredContent>),
                loaded: () => (<MainContent />),
            });
        }}
    </Observer>);
}

function MainContent() {
    const store = useSelectFormDialogStore();
    return (
        <div className="flex flex-col h-full overflow-hidden rounded-b-[var(--dimen-dialog-radius)]">
            <ListView />
            {store.isPaginationRequired && <ListPagination />}
        </div>
    );
}



function ListView() {
    const store = useSelectFormDialogStore();
    return (<div className="flex flex-1 flex-col overflow-y-auto divide-y divide-default">
        {store.data.items.map((form) => (<ListItem form={form} onClick={() => { store.onFormSelected(form) }} />))}
    </div>);
}

function ListPagination() {
    const store = useSelectFormDialogStore();
    return (<div className="px-4 py-3 border-t border-default flex justify-center">
        <Pagination
            currentPage={store.currentPage}
            totalPages={store.data.pageInfo.totalPages}
            onNext={() => store.loadData(store.currentPage + 1)}
            onPrev={() => store.loadData(store.currentPage - 1)}
            onFirst={() => store.loadData(1)}
            onLast={() => store.loadData(store.data.pageInfo.totalPages)}
        />
    </div>);
}


type FormItemProps = {
    form: FormCompareItemVm;
    onClick: (form: FormCompareItemVm) => void;
};

function ListItem({ form, onClick }: FormItemProps) {
    const status = form.item.adminFormStatus;
    const isDisabled = !form.isEligibleForComparison;

    return (
        <div
            className={clsx(
                "px-4 py-3 space-x-2 flex flex-row items-center group",
                "bg-surface",
                {
                    "cursor-pointer hover:bg-surface-hover": !isDisabled,
                    "opacity-70 cursor-not-allowed": isDisabled,
                }
            )}
            onClick={() => { onClick(form) }}
        >
            <div className="space-y-1 flex-1">
                {/* Header Part - Badges */}
                <div className="space-x-2">
                    <AdminFormStatusBadge status={status} size="sm" />
                    {form.item.assessmentType && (<AssmntTypeBadge type={form.item.assessmentType} />)}
                </div>

                {/* Title and Main Content */}
                <div
                    className={clsx("text-secondary text-sm space-y-1", {
                        "text-disabled": isDisabled,
                    })}
                >

                    {/* Title */}
                    <div
                        className={clsx(
                            "text-base-m font-medium group-hover:text-primary",
                            {
                                "text-default": !isDisabled,
                                "text-disabled": isDisabled,
                            }
                        )}
                    >
                        {form.item.title}
                    </div>


                    {/* Details */}
                    <div>
                        {form.item.totalQuestions} Questions •{" "}
                        {NumFmt.roundToStr(form.item.totalMarks, 2)} Marks •{" "}
                        {form.item.totalResponses} Responses
                    </div>
                    <div>Start Date: {form.item.startDate ? DateFmt.datetime(form.item.startDate) : "N/A"}</div>
                    <div>End Date: {form.item.endDate ? DateFmt.datetime(form.item.endDate) : "N/A"}</div>
                </div>

            </div>

            <Observer>
                {() => (
                    <OutlinedButton
                        size="sm"
                        disabled={form.isSelectBtnDisabled}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!form.isSelectBtnDisabled) onClick(form);
                        }}
                    >
                        Select
                    </OutlinedButton>
                )}
            </Observer>
        </div>
    );
}
