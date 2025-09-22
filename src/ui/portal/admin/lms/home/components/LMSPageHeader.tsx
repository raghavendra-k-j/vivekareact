import { ReactNode } from "react";
import { AdminPageAppBar, AdminPageAppBarTitle } from "~/ui/portal/admin/components/PageAppBar";
import { Input } from "~/ui/widgets/form/Input";
import { LMSViewSwitcher } from "./ViewSwitcher";

export interface LMSPageHeaderProps {
    title: string;
    search: ReactNode;
    filters?: ReactNode;
    trailingButtons?: ReactNode;
    bottom?: ReactNode;
}

export interface LMSPageHeaderSearchProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

export function LMSPageHeaderSearch({ placeholder, value, onChange }: LMSPageHeaderSearchProps) {
    return (
        <Input
            placeholder={placeholder}
            type="search"
            className="w-64 sm:w-80 md:w-96 lg:w-[28rem] xl:w-[32rem]"
            inputSize="md"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}


export function LMSPageHeader(props: LMSPageHeaderProps) {
    const { title, search, filters, trailingButtons: trailing, bottom, } = props;
    return (
        <AdminPageAppBar
            start={<AdminPageAppBarTitle title={title} />}
            end={
                <div className="flex flex-row items-center gap-3">
                    <LMSViewSwitcher />
                    {filters}
                    {search}
                    {trailing && <div className="flex items-center gap-2">{trailing}</div>}
                </div>
            }
            bottom={bottom}
        />
    );
}