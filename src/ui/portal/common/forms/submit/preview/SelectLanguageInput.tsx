import { FSelectField, FSelectOption } from "~/ui/widgets/form/SelectField";
import { useSubmitStore } from "../SubmitContext";
import { Language } from "~/domain/forms/models/Language";
import { useMemo } from "react";
import { Observer } from "mobx-react-lite";

export function SelectLanguageInput() {
    const store = useSubmitStore();
    const { languages } = store.formDetail;

    const options: FSelectOption<Language>[] = useMemo(() =>
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
                    label="Select Language"
                    required
                    field={store.selectedLanguageField}
                    options={options}
                    placeholder="Please select a language"
                />
            )}
        </Observer>
    );
}
