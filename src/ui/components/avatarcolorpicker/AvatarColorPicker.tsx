import { useState } from "react";
import { AvatarColor } from "~/domain/common/models/AvatarColor";
import { Input } from "~/ui/widgets/form/Input";

export interface AvatarColorPickerProps {
    value: AvatarColor | null;
    onChange: (color: AvatarColor | null) => void;
    className?: string;
}

// Dark colors (white text)
const DARK_COLORS = [
    new AvatarColor({ bgColor: "#3B82F6", fgColor: "#FFFFFF" }), // Blue
    new AvatarColor({ bgColor: "#EF4444", fgColor: "#FFFFFF" }), // Red
    new AvatarColor({ bgColor: "#10B981", fgColor: "#FFFFFF" }), // Green
    new AvatarColor({ bgColor: "#F59E0B", fgColor: "#FFFFFF" }), // Yellow
    new AvatarColor({ bgColor: "#8B5CF6", fgColor: "#FFFFFF" }), // Purple
    new AvatarColor({ bgColor: "#06B6D4", fgColor: "#FFFFFF" }), // Cyan
    new AvatarColor({ bgColor: "#F97316", fgColor: "#FFFFFF" }), // Orange
    new AvatarColor({ bgColor: "#84CC16", fgColor: "#FFFFFF" }), // Lime
    new AvatarColor({ bgColor: "#EC4899", fgColor: "#FFFFFF" }), // Pink
    new AvatarColor({ bgColor: "#6366F1", fgColor: "#FFFFFF" }), // Indigo
    new AvatarColor({ bgColor: "#14B8A6", fgColor: "#FFFFFF" }), // Teal
    new AvatarColor({ bgColor: "#F43F5E", fgColor: "#FFFFFF" }), // Rose
    new AvatarColor({ bgColor: "#8B5A2B", fgColor: "#FFFFFF" }), // Brown
    new AvatarColor({ bgColor: "#64748B", fgColor: "#FFFFFF" }), // Slate
    new AvatarColor({ bgColor: "#7C3AED", fgColor: "#FFFFFF" }), // Violet
    new AvatarColor({ bgColor: "#059669", fgColor: "#FFFFFF" }), // Emerald
];

// Light colors (dark text)
const LIGHT_COLORS = [
    new AvatarColor({ bgColor: "#E0F2FE", fgColor: "#0C4A6E" }), // Light Blue
    new AvatarColor({ bgColor: "#FEF2F2", fgColor: "#991B1B" }), // Light Red
    new AvatarColor({ bgColor: "#F0FDF4", fgColor: "#166534" }), // Light Green
    new AvatarColor({ bgColor: "#FFFBEB", fgColor: "#92400E" }), // Light Yellow
    new AvatarColor({ bgColor: "#FCE7F3", fgColor: "#9D174D" }), // Light Pink
    new AvatarColor({ bgColor: "#E0E7FF", fgColor: "#3730A3" }), // Light Indigo
    new AvatarColor({ bgColor: "#CCFBF1", fgColor: "#0F766E" }), // Light Teal
    new AvatarColor({ bgColor: "#FFF1F2", fgColor: "#BE123C" }), // Light Rose
];

export function AvatarColorPicker({ value, onChange, className = "" }: AvatarColorPickerProps) {
    const [customBgColor, setCustomBgColor] = useState("#000000");
    const [customFgColor, setCustomFgColor] = useState("#FFFFFF");
    const [showCustomInput, setShowCustomInput] = useState(false);

    const handlePredefinedColorSelect = (color: AvatarColor) => {
        onChange(color);
        setShowCustomInput(false);
    };

    const handleCustomColorChange = (bgColor: string, fgColor: string) => {
        setCustomBgColor(bgColor);
        setCustomFgColor(fgColor);
        const color = new AvatarColor({
            bgColor: bgColor,
            fgColor: fgColor
        });
        onChange(color);
    };

    const isCustomColorSelected = value && ![...DARK_COLORS, ...LIGHT_COLORS].some(color =>
        color.bgColor.toLowerCase() === value.bgColor.toLowerCase() &&
        color.fgColor.toLowerCase() === value.fgColor.toLowerCase()
    );

    const ColorSection = ({ title, colors }: { title: string; colors: AvatarColor[] }) => (
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">{title}</h4>
            <div className="flex gap-2 flex-wrap">
                {colors.map((color, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                            value?.bgColor === color.bgColor && value?.fgColor === color.fgColor
                                ? "border-gray-800 ring-2 ring-gray-400"
                                : "border-gray-300 hover:border-gray-500"
                        }`}
                        style={{ backgroundColor: color.bgColor }}
                        onClick={() => handlePredefinedColorSelect(color)}
                        title={`${title} ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className={`space-y-4 ${className}`}>
            <ColorSection title="Dark Colors" colors={DARK_COLORS} />
            <ColorSection title="Light Colors" colors={LIGHT_COLORS} />

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-700">Custom Color</h4>
                    <button
                        type="button"
                        className={`w-6 h-6 rounded-full border-2 border-dashed transition-all hover:scale-110 ${
                            isCustomColorSelected
                                ? "border-gray-800 ring-2 ring-gray-400"
                                : "border-gray-400 hover:border-gray-600"
                        }`}
                        style={{
                            background: isCustomColorSelected
                                ? `linear-gradient(45deg, ${value?.bgColor} 25%, transparent 25%, transparent 75%, ${value?.bgColor} 75%)`
                                : 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%)'
                        }}
                        onClick={() => setShowCustomInput(!showCustomInput)}
                        title="Custom color"
                    >
                        <span className="text-xs font-bold text-gray-600">+</span>
                    </button>
                </div>

                {showCustomInput && (
                    <div className="p-3 bg-gray-50 rounded-md space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-600">Background</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={isCustomColorSelected ? value?.bgColor : customBgColor}
                                        onChange={(e) => handleCustomColorChange(e.target.value, isCustomColorSelected ? value?.fgColor || customFgColor : customFgColor)}
                                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                                        title="Pick background color"
                                    />
                                    <Input
                                        type="text"
                                        value={isCustomColorSelected ? value?.bgColor : customBgColor}
                                        onChange={(e) => handleCustomColorChange(e.target.value, isCustomColorSelected ? value?.fgColor || customFgColor : customFgColor)}
                                        placeholder="#000000"
                                        className="flex-1 text-sm font-mono"
                                        title="Background color hex code"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-600">Text Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={isCustomColorSelected ? value?.fgColor : customFgColor}
                                        onChange={(e) => handleCustomColorChange(isCustomColorSelected ? value?.bgColor || customBgColor : customBgColor, e.target.value)}
                                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                                        title="Pick text color"
                                    />
                                    <Input
                                        type="text"
                                        value={isCustomColorSelected ? value?.fgColor : customFgColor}
                                        onChange={(e) => handleCustomColorChange(isCustomColorSelected ? value?.bgColor || customBgColor : customBgColor, e.target.value)}
                                        placeholder="#FFFFFF"
                                        className="flex-1 text-sm font-mono"
                                        title="Text color hex code"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                                Preview: <span
                                    className="px-2 py-1 rounded text-xs font-medium"
                                    style={{
                                        backgroundColor: isCustomColorSelected ? value?.bgColor : customBgColor,
                                        color: isCustomColorSelected ? value?.fgColor : customFgColor
                                    }}
                                >
                                    Sample Text
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCustomInput(false)}
                                className="text-gray-500 hover:text-gray-700 text-sm"
                                title="Close custom color picker"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}