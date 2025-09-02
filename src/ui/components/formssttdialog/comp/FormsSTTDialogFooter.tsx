import { Observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { Language } from "~/domain/forms/models/Language";
import FilledButton from "~/ui/widgets/button/FilledButton";
import OutlinedButton from "~/ui/widgets/button/OutlinedButton";
import { FSelectField, FSelectOption } from "~/ui/widgets/form/SelectField";
import { useFormsSTTDialogStore } from "../FormSTTDialogContext";
import { IconButton } from "~/ui/widgets/button/IconButton";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "~/ui/widgets/badges/Badge";

export function FormsSTTDialogFooter() {
    const store = useFormsSTTDialogStore();
    return (<>
        {store.shouldShowSettings && <SettingsView />}
        <FooterActions />
    </>);
}

function FooterActions() {
    const store = useFormsSTTDialogStore();
    return (
        <div className="flex flex-row items-center justify-end px-4 py-3 border-t border-default">
            <div className="flex justify-end gap-2">
                <OutlinedButton onClick={() => store.handleOnClickCancel()}>
                    Cancel
                </OutlinedButton>
                <Observer>
                    {() => (
                        <FilledButton
                            disabled={!store.isDoneButtonEnabled}
                            onClick={() => store.handleOnClickDone()}
                        >
                            Done
                        </FilledButton>
                    )}
                </Observer>
            </div>
        </div>
    );
}


function SettingsView() {
    const [expanded, setExpanded] = useState(false);
    const toggleExpanded = () => {
        setExpanded(!expanded);
    }
    return (<div className="bg-surface border border-default rounded-sm shadow-xs mx-4 my-4 text-default">
        <div onClick={toggleExpanded} className="flex items-center justify-between ps-3 pe-1 py-1 cursor-pointer">
            <div className="flex flex-col gap-1">
                <div className="font-semibold">Speech Settings</div>
                {!expanded && <CollapsedSettingsPreview />}
            </div>
            <IconButton
                size="sm"
                icon={expanded ? <ChevronUp /> : <ChevronDown />}
                onClick={toggleExpanded}
                variant="ghost"
                color="secondary"
            />
        </div>
        {expanded && <ExpandedSettingsView />}
    </div>);

}



function AICheckboxView() {
    const store = useFormsSTTDialogStore();
    return (
        <Observer>
            {() => {
                return (
                    <div className="flex flex-col gap-2">
                        {/* Checkbox */}
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="enable-ai"
                                checked={store.docOptions.aiEnabled}
                                onChange={() => store.docOptions.toggleAiEnabled()}
                                className="mr-2 w-4 h-4 flex-shrink-0 mt-1.5"
                            />
                            <div>

                                <label htmlFor="enable-ai" className="text-base-m text-default select-none cursor-pointer">
                                    <div>
                                        AI Formatting
                                    </div>
                                    <div className="text-secondary text-sm-m">
                                        Automatically fixes minor spelling errors and formats math or scientific expressions.
                                    </div>
                                </label>

                                {/* Conditional Banner BELOW checkbox */}
                                {store.docOptions.aiEnabled && (
                                    <div className="text-amber-800 text-sm-m mt-2">
                                        <b>Note:</b> AI Formatting is experimental and may make mistakes.
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>
                );
            }}
        </Observer>
    );
}



function LanguageSelectView() {
    const store = useFormsSTTDialogStore();
    const languages = store.options.languages;

    const options: FSelectOption<Language>[] = useMemo(
        () =>
            languages.map((language) => ({
                data: language,
                value: (l) => l.id,
                label: (l) => l.name,
            })),
        [languages]
    );

    return (
        <Observer>
            {() => (
                <FSelectField
                    id="form-language-select"
                    label="Speech Language"
                    field={store.options.languageField}
                    options={options}
                    placeholder="Select speech language"
                />
            )}
        </Observer>
    );
}


function ExpandedSettingsView() {
    const store = useFormsSTTDialogStore();
    return (<div>
        <div className="px-4 py-3 flex flex-col gap-4 border-t border-default">
            {store.shouldShowLanguageSelector && <LanguageSelectView />}
            {store.shouldShowToggleEnableAi && <AICheckboxView />}
        </div>
    </div>);
}

function CollapsedSettingsPreview() {
    const store = useFormsSTTDialogStore();
    return (<Observer>
        {() => {
            let languageLabel: string | null = null;
            let aiFormattingLabel: string | null = null;
            if (store.shouldShowLanguageSelector) {
                languageLabel = store.options.language.name;
            }
            if (store.shouldShowToggleEnableAi) {
                aiFormattingLabel = store.docOptions.aiEnabled ? "AI Formatting Enabled" : "AI Formatting Disabled";
            }
            const shouldShowAnyBadge = languageLabel || aiFormattingLabel;

            if (!shouldShowAnyBadge) return null;


            return (
                <div className="pb-1">
                    {languageLabel && (
                        <Badge
                            size="sm"
                            className="me-2"
                            color="primary"
                        >
                            {languageLabel}
                        </Badge>
                    )}
                    {aiFormattingLabel && (
                        <Badge
                            size="xs"
                            color="indigo"
                            className="me-2"
                        >
                            {aiFormattingLabel}
                        </Badge>
                    )}
                </div>
            );
        }}
    </Observer>);
}


