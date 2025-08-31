import React, { useMemo } from "react";
import type { LaTexExpr } from "~/domain/latexkb/models/LaTexExpr";
import { LaTexKbService } from "~/domain/latexkb/services/LaTexKbService";
import { FormsSTTLaTexOptions } from "../formssttdialog/models/FormatSTTOptions";
import { LaTexKbContext } from "./LaTexKbContext";
import { LaTexKbStore } from "./LaTextKbStore";


export type LaTexKbProps = {
    expr: LaTexExpr | null;
    onDone: (expr: LaTexExpr) => void;
    onClose: () => void;
    enableStt: boolean;
    sttOptions: FormsSTTLaTexOptions | null;
};

export function LaTexKbProvider({ children, props }: { children: React.ReactNode, props: LaTexKbProps }) {
    const store = useMemo(() => {
        const latexService = new LaTexKbService();
        return new LaTexKbStore({
            latexKbService: latexService,
            onDone: props.onDone,
            onClose: props.onClose,
            expr: props.expr,
            enableStt: props.enableStt,
            sttOptions: props.sttOptions,
        });
    }, [props.expr, props.onDone, props.onClose]);

    return (
        <LaTexKbContext.Provider value={store}>
            {children}
        </LaTexKbContext.Provider>
    );
}
