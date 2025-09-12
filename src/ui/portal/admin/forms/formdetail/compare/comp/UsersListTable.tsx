import { Observer } from "mobx-react-lite";
import { useAdminFormCompareStore } from "../ComparePageContext";
import { NumFmt } from "~/core/utils/NumFmt";
import { TimeFmt } from "~/core/utils/TimeFmt";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { FormCompareUserItemVm } from "../models/FormCompareUserListVm";
import { FormCompareDetailsVm } from "../models/FormCompareDetailsVm";
import { Pagination } from "~/ui/widgets/pagination/Pagination";
import { ReactNode } from "react";
import { UserTileItem } from "./UserRow";
import { MoveDown, MoveUp } from "lucide-react";
import { UsersTableOption } from "../models/UsersTableOption";
import clsx from "clsx";

export function UsersListTable() {
    const store = useAdminFormCompareStore();
    return (<Observer>
        {() => {
            return store.userListState.stateWhen({
                initOrLoading: () => <CenteredLoader />,
                error: () => <TableErrorView />,
                loaded: () => <UsersTableContent />
            });
        }}
    </Observer>);
}


function UsersTableContent() {
    const store = useAdminFormCompareStore();
    const compareFormDetails = store.compareVm.detailsVm;
    const userTableOptions = store.userTableOptions;
    const usersData = store.userListState.data!;

    const { formALabel, formBLabel } = compareFormDetails;
    const users = usersData.items;
    const pageInfo = usersData.pageInfo;

    return (
        <>
            {/* Main Table */}
            <div className="overflow-x-auto datatable-scrollbar">
                <table className="min-w-full datatable datatable-bordered-h">
                    <TableHeader formALabel={formALabel} formBLabel={formBLabel} options={userTableOptions} />
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <UserRow
                                    key={user.base.participantKey}
                                    item={user}
                                    compareFormDetails={compareFormDetails}
                                    showStatus={userTableOptions.showPassStatusColumn}
                                    showTime={userTableOptions.showTimeTakenColumn}
                                />
                            ))
                        ) : (
                            <TableEmptyRow colSpan={userTableOptions.wholeTableColSpan} />
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end px-3 py-2">
                <Pagination
                    currentPage={pageInfo.page}
                    totalPages={pageInfo.totalPages}
                    onNext={() => store.fetchComparisonUsers({ page: pageInfo.page + 1 })}
                    onPrev={() => store.fetchComparisonUsers({ page: pageInfo.page - 1 })}
                    onFirst={() => store.fetchComparisonUsers({ page: 1 })}
                    onLast={() => store.fetchComparisonUsers({ page: pageInfo.totalPages })}
                />
            </div>
        </>
    );
}





const TableHeader = (props: { formALabel: string; formBLabel: string; options: UsersTableOption; }) => (
    <thead className="datatable-head datatable-header-bordered">
        <tr>
            <TableHeaderCell></TableHeaderCell>
            <TableHeaderCell align="text-center" colSpan={3}>Marks</TableHeaderCell>
            {props.options.showPassStatusColumn && <TableHeaderCell align="text-center" colSpan={2}>Result</TableHeaderCell>}
            {props.options.showTimeTakenColumn && <TableHeaderCell align="text-center" colSpan={3}>Time Taken</TableHeaderCell>}
        </tr>
        <tr>
            <TableHeaderCell>User Details</TableHeaderCell>
            <TableHeaderCell>{props.formALabel}</TableHeaderCell>
            <TableHeaderCell>{props.formBLabel}</TableHeaderCell>
            <TableHeaderCell>Change</TableHeaderCell>
            {props.options.showPassStatusColumn && (
                <>
                    <TableHeaderCell>{props.formALabel}</TableHeaderCell>
                    <TableHeaderCell>{props.formBLabel}</TableHeaderCell>
                </>
            )}
            {props.options.showTimeTakenColumn && (
                <>
                    <TableHeaderCell>{props.formALabel}</TableHeaderCell>
                    <TableHeaderCell>{props.formBLabel}</TableHeaderCell>
                    <TableHeaderCell>Change</TableHeaderCell>
                </>
            )}
        </tr>
    </thead>
);



const UserRow = ({
    item,
    compareFormDetails,
    showStatus,
    showTime,
}: {
    item: FormCompareUserItemVm;
    compareFormDetails: FormCompareDetailsVm;
    showStatus: boolean;
    showTime: boolean;
}) => {
    const renderStatusBadge = (passed?: boolean) => {
        if (passed === true) {
            return <StatusBadge text="Pass" color="green" />;
        } else if (passed === false) {
            return <StatusBadge text="Fail" color="red" />;
        } else {
            return <StatusBadge text="N/A" color="gray" />;
        }
    };

    const renderMarksChange = () => {
        let changeText: string;
        let iconClassName: string;
        let iconElement: ReactNode;

        const formattedPercentage = NumFmt.roundToStr(Math.abs(item.base.percentageChange.value), 2);
        const marksChange = NumFmt.roundToStr(Math.abs(item.marksChange.value), 2);
        if (item.marksChange.isIncrease) {
            changeText = compareFormDetails.isSameTotalMarks ? `${formattedPercentage}% (+${marksChange})` : `${formattedPercentage}%`;
            iconClassName = "text-emerald-600";
            iconElement = <MoveUp size={14} className="inline ml-1" />;
        }
        else if (item.marksChange.isDecrease) {
            changeText = compareFormDetails.isSameTotalMarks ? `${formattedPercentage}% (-${marksChange})` : `${formattedPercentage}%`;
            iconClassName = "text-red-600";
            iconElement = <MoveDown size={14} className="inline ml-1" />;
        }
        else {
            changeText = "No Change";
            iconClassName = "text-default";
            iconElement = null;
        }

        return (
            <span className={`text-default`}>
                {changeText}
                <span className={iconClassName}>{iconElement}</span>
            </span>
        );
    };

    return (
        <tr>
            <TableDataCell>
                <UserTileItem user={item.base.userTile} guest={item.base.guestTile} />
            </TableDataCell>
            <TableDataCell>
                {formatMarksColumn(
                    item.base.formA.percentage,
                    item.base.formA.marks,
                    compareFormDetails.formA.totalMarks
                )}
            </TableDataCell>

            <TableDataCell>
                {formatMarksColumn(
                    item.base.formB.percentage,
                    item.base.formB.marks,
                    compareFormDetails.formB.totalMarks
                )}
            </TableDataCell>
            <TableDataCell>
                {renderMarksChange()}
            </TableDataCell>
            {showStatus && (
                <>
                    <TableDataCell align="center">{renderStatusBadge(item.base.formA.passed!)}</TableDataCell>
                    <TableDataCell align="center">{renderStatusBadge(item.base.formB.passed!)}</TableDataCell>
                </>
            )}
            {showTime && (
                <>
                    <TableDataCell>{TimeFmt.format(item.base.formA.timeTaken)}</TableDataCell>
                    <TableDataCell>{TimeFmt.format(item.base.formB.timeTaken)}</TableDataCell>
                    <TableDataCell>
                        {TimeFmt.format(Math.abs(item.base.timeTakenChange.value))}
                        {item.base.timeTakenChange.isIncrease ? (
                            <span className="inline ml-1 text-red-600">Slower</span>
                        ) : item.base.timeTakenChange.isDecrease ? (
                            <span className="inline ml-1 text-emerald-600">Faster</span>
                        ) : item.base.timeTakenChange.isNoChange ? (
                            <span className="inline ml-1 text-gray-600">No Change</span>
                        ) : null}
                    </TableDataCell>
                </>
            )}
        </tr>
    );
};



const TableHeaderCell = ({
    children,
    align = "text-left",
    className = "",
    colSpan = 1,
    rowSpan = 1,
}: {
    children?: React.ReactNode;
    align?: "text-left" | "text-center" | "text-right";
    className?: string;
    colSpan?: number;
    rowSpan?: number;
}) => (
    <th
        colSpan={colSpan}
        rowSpan={rowSpan}
        className={clsx(
            "px-4 py-2 text-sm font-semibold text-secondary uppercase whitespace-nowrap",
            align,
            className
        )}
    >
        {children}
    </th>
);

const TableDataCell = ({
    children,
    align = "left",
    className = "",
}: {
    children: React.ReactNode;
    align?: "left" | "center" | "right";
    className?: string;
}) => (
    <td className={`px-4 py-2.5 whitespace-nowrap text-sm text-default text-${align} ${className}`}>
        {children}
    </td>
);

const StatusBadge = ({ text, color }: { text: string; color: "green" | "red" | "gray" }) => {
    const colorMap = {
        green: "text-emerald-700 bg-emerald-50",
        red: "text-red-700 bg-red-50",
        gray: "text-default",
    };
    return (
        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${colorMap[color]}`}>
            {text}
        </span>
    );
};

const TableEmptyRow = ({ colSpan }: { colSpan: number }) => (
    <tr>
        <td colSpan={colSpan} className="text-center text-base text-default py-4 px-4">
            No users found matching your criteria.
        </td>
    </tr>
);

const TableErrorView = () => {
    const store = useAdminFormCompareStore();
    return (<SimpleRetryableAppView
        className="p-6 border-t border-default"
        appError={store.userListState.error!}
        onRetry={() => store.fetchComparisonUsers()}
    />);
};

const CenteredLoader = () => (
    <div className="flex flex-col justify-center items-center min-h-[200px] p-6 border-t border-default">
        <LoaderView />
    </div>
);


const formatMarksColumn = (
    percentage: number,
    marks: number,
    totalMarks: number
): string => {
    return `${NumFmt.roundToStr(percentage, 2)} % (${NumFmt.roundToStr(marks, 2)}/${NumFmt.roundToStr(totalMarks, 2)})`;
};