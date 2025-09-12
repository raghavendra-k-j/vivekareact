import React, { ReactNode } from "react";
import { QPGenPageContext } from "./QPGenPageContext";
import { QPGenPageStore } from "./QPGenPageStore";

interface QPGenPageProviderProps {
    children: ReactNode;
}

export const QPGenPageProvider: React.FC<QPGenPageProviderProps> = ({ children }) => {
    const store = React.useMemo(() => new QPGenPageStore(), []);
    return (
        <QPGenPageContext.Provider value={store}>
            {children}
        </QPGenPageContext.Provider>
    );
};
