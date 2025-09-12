import { QuestionVm } from "../models/QuestionVm";
import { Observer } from "mobx-react-lite";
import { Volume2 } from "lucide-react";
import { FaCirclePause } from "react-icons/fa6";

export type SpeakButtonProps = {
    vm: QuestionVm;
};

export function SpeakButton(props: SpeakButtonProps) {
    const store = props.vm.base.store;

    return (
        <Observer>
            {() => {
                const isSpeaking = store.parentStore.isSpeaking(props.vm);
                return (
                    <button
                        onClick={() => store.parentStore.onClickSpeakQuestion(props.vm)}
                        className={`flex items-center justify-center w-8 h-8 rounded-full border border-default 
                                    transition-colors duration-200 hover:bg-gray-100
                                    focus:outline-none
                                    ${isSpeaking ? "text-red-600" : "text-default"}`}
                        title={isSpeaking ? "Pause" : "Speak"}
                    >
                        {isSpeaking ? <FaCirclePause size={18} /> : <Volume2 size={18} />}
                    </button>
                );
            }}
        </Observer>
    );
}