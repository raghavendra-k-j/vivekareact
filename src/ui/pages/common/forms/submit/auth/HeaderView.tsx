import React from "react";

interface HeaderViewProps {
    title: React.ReactNode;
    subTitle: React.ReactNode;
}

const HeaderView: React.FC<HeaderViewProps> = ({ title, subTitle }) => (
    <div className="px-6 py-4">
        <h2 className="text-base font-semibold text-default">
            {title}
        </h2>
        <div className="text-sm text-secondary mt-0.5">
            {subTitle}
        </div>
    </div>
);

export { HeaderView };