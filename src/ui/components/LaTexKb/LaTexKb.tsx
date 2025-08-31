import { useLaTexKbStore } from "./LaTexKbContext";
import { LaTexKbProvider, type LaTexKbProps } from "./LaTexKbProvider";
import { InputView } from "./comp/InputView";
import type { MathfieldElement } from "mathlive";
import { useCallback } from "react";
import { KeyboardContainer } from "./comp/KeyboardConatinerView";
import { FramedDialog } from "~/ui/widgets/dialogmanager";
import { X } from "lucide-react";

export const LatexKb = (props: LaTexKbProps) => {
  return (
    <LaTexKbProvider props={props}>
      <Body />
    </LaTexKbProvider>
  );
}

function Body() {
  const store = useLaTexKbStore();

  const handleReady = useCallback((mf: MathfieldElement) => {
    store.onMfReady(mf);
  }, [store]);

  return (<div>
    <FramedDialog
      onClose={() => store.onClickClose()}
      scaffoldClassName="p-0 md:p-4"
      contentClassName="max-w-[776px] w-full h-full md:max-h-[600px] overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between bg-surface border-b border-slate-200 px-3 py-2 font-semibold rounded-t-sm">
        <span>Math Equation</span>
        <button
          type="button"
          onClick={() => store.onClickClose()}
          className="p-1 rounded hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X />
        </button>
      </div>
      <InputView onReady={handleReady} store={store} />
      <KeyboardContainer />
    </FramedDialog>
  </div>);
}