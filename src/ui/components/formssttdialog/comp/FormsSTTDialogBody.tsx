import { Observer } from "mobx-react-lite";
import { useFormsSTTDialogStore } from "../FormSTTDialogContext";
import { AiOutputView } from "./AiOutputView";
import { CancelButton, DoneButton, MicButton } from "./Buttons";
import clsx from "clsx";
import { computeSTTState } from "../ComputeStateUtil";
import { logger } from "~/core/utils/logger";

export function FormsSTTDialogBody() {
    const store = useFormsSTTDialogStore();
    return (
        <div className="flex flex-col flex-1 pb-4 pt-12 gap-4 overflow-hidden">
            <div className="flex flex-col justify-center items-center">
                <Observer>
                    {() => {
                        logger.debug("Computing STT state for FormsSTTDialogBody");
                        const computedProps = computeSTTState({
                            sttState: store.sttState,
                            formatState: store.formatState,
                        });
                        const { isRecording, message, description } = computedProps;
                        return (
                            <>
                                <div className={clsx(isRecording && "flex flex-row items-center justify-center gap-4")}>
                                    {/* Cancel Icon */}
                                    {isRecording && (<CancelButton onClick={() => store.handleOnClickCancelRecording()} />)}

                                    {/* Mic Button */}
                                    <MicButton
                                        iconClassName={computedProps.iconClassName}
                                        Icon={computedProps.Icon}
                                        onClick={() => store.handleOnClickMicButton()}
                                        buttonDisabled={computedProps.buttonDisabled}
                                    />

                                    {/* Done Button */}
                                    {isRecording && <DoneButton onClick={() => store.handleOnClickDoneRecording()} />}
                                </div>
                                <div className="mt-4 text-center px-4">
                                    <div className="text-base-m text-secondary font-semibold">
                                        {message}
                                    </div>
                                    {description && (<div className="text-sm text-secondary">{description}</div>)}
                                </div>
                            </>
                        );
                    }}
                </Observer>
            </div>
            <AiOutputView />
        </div>
    );
}