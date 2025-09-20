import React, { useEffect } from "react";
import { NotFoundView } from "../error/NotFoundView";

const NotFoundPage: React.FC = () => {
    useEffect(() => {
        const root = document.documentElement;

        const orangeTokens: Record<string, string> = {
            "--color-primary-50": "#fff7ed",
            "--color-primary-100": "#ffedd5",
            "--color-primary-200": "#fed7aa",
            "--color-primary-300": "#fdba74",
            "--color-primary-400": "#fb923c",
            "--color-primary-500": "#f97316",
            "--color-primary-600": "#ea580c",
            "--color-primary-700": "#c2410c",
            "--color-primary-800": "#9a3412",
            "--color-primary-900": "#7c2d12",
            "--color-primary-950": "#431407",
            "--color-primary": "#ea580c",
        };

        Object.entries(orangeTokens).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-gradient p-6">
            <NotFoundView />
        </div>
    );
};

export default NotFoundPage;
