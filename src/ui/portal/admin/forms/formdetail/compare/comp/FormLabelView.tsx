import React, { useState, useEffect } from "react";
import { Edit, Check } from "lucide-react";

type FormLabelViewProps = {
    label: string;
    onLabelChange: (newLabel: string) => void;
};

export function FormLabelView({ label, onLabelChange }: FormLabelViewProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [labelText, setLabelText] = useState(label);
    const [prevLabel, setPrevLabel] = useState(label);

    useEffect(() => {
        setLabelText(label);
        setPrevLabel(label);
    }, [label]);

    const handleSave = () => {
        if (labelText.trim() !== "") {
            setIsEditing(false);
            onLabelChange(labelText);
        } else {
            setLabelText(prevLabel);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length <= 30) {
            setLabelText(e.target.value);
        }
    };

    return (
        <div>
            <div className="inline-flex flex-row items-center justify-between space-x-2 text-primary bg-primary-100/50 px-2 py-1 rounded-sm text-sm">
                {isEditing ? (
                    <input
                        autoFocus
                        value={labelText}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSave();
                            }
                        }}
                        className="text-base-m font-semibold bg-transparent border border-default rounded px-1 focus:outline-none focus:ring-1 focus:border-primary"
                    />
                ) : (
                    <span className="font-semibold">{labelText}</span>
                )}
                <button
                    className="cursor-pointer"
                    onClick={() => {
                        if (isEditing) {
                            handleSave();
                        } else {
                            setIsEditing(true);
                        }
                    }}
                    title={isEditing ? "Save label" : "Edit label"}
                >
                    {isEditing ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
