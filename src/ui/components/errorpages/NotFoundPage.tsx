import React from "react";
import { NotFoundView } from "../error/NotFoundView";

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-gradient p-6">
            <NotFoundView />
        </div>
    );
};

export default NotFoundPage;
