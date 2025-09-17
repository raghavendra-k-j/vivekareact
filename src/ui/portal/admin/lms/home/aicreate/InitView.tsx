import { Observer } from "mobx-react-lite";
import { PromptsView } from "./PromptsView";


function HeaderSection() {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-xl font-semibold text-strong mb-2">
                    Create Your LMS Hierarchy with AI
                </h3>
                <p className="text-secondary text-sm max-w-2xl mx-auto">
                    Create new folders and empty courses for your organization quickly. Describe how you want them named and arranged, or pick a sample template below, and we'll generate the hierarchy for you.
                </p>
            </div>
        </div>
    );
}

// Main IntroView Component
export function IntroView({ onPromptSelect }: IntroViewProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <HeaderSection />

            <Observer>
                {() => (
                    <PromptsView
                        onPromptSelected={onPromptSelect}
                    />
                )}
            </Observer>
        </div>
    );
}