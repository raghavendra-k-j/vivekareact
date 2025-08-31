import { useRef } from "react";
import { AiGenPageContext, useAiGenPageStore } from "./AiGenPageContext";
import { AiGenPageStore } from "./AiGenPageStore";
import InputSourceStepView from "./components/InputSource";
import { Button } from "~/ui/widgets/button/Button";
import { IconButton } from "~/ui/widgets/button/IconButton";
import { ArrowLeft } from "lucide-react";
import { BackButtonIcon } from "~/ui/components/buttons/BackButtonIcon";

export default function AiGenPage() {
    return (
        <AiGenPageProvider>
            <MainConsumer />
        </AiGenPageProvider>
    );
}

function AiGenPageProvider({ children }: { children: React.ReactNode }) {
    const store = useRef<AiGenPageStore>(new AiGenPageStore());
    return (
        <AiGenPageContext.Provider value={store}>
            {children}
        </AiGenPageContext.Provider>
    );
}

function MainConsumer() {
    const store = useAiGenPageStore();
    return (
        <div className="bg-gradient-to-r from-blue-100 to-pink-100 min-h-screen">
            <Header />
            <div className="p-6">
                <MainCard />
            </div>
        </div>
    );
}


function Header() {
    return (<div className="bg-white shadow px-6 py-2 h-14">
        <div className="flex flex-row items-center space-x-3">
            <BackButtonIcon />
            <h1 className="text-lg text-default font-bold">New Assessment</h1>
        </div>
    </div>);
}


function MainCard() {
    return (<InputSourceStepView />);
}