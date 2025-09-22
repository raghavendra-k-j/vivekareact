import React from "react";
import { EasyTable, EasyTableProps } from "~/ui/components/easytable";

interface LMSTableWrapperProps<T = any> extends Omit<EasyTableProps<T>, 'scrollable'> {
    children?: React.ReactNode;
}

export function LMSTableWrapper<T = any>(props: LMSTableWrapperProps<T>) {
    return (
        <div className="p-4 sm:p-6 h-full flex flex-col overflow-hidden">
            <EasyTable<T>
                {...props}
                scrollable={true}
            />
        </div>
    );
}