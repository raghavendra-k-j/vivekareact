import React, { ReactNode } from "react";

type InputFieldContainerProps = React.HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode;
};


function InputFieldContainer({
    children,
    ...divProps
}: InputFieldContainerProps) {
    return (
        <div className="flex flex-col gap-1" {...divProps}>
            {children}
        </div>
    );
}


export { InputFieldContainer };