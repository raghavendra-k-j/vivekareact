import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { PageLoader } from "./ui/components/loaders/PageLoader";
import NotFoundPage from "./ui/pages/error/NotFoundPage";

const MainHome = lazy(() => import("./ui/pages/main/home/HomePage"));

export default function Router() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/" element={<MainHome />} />
                <Route path="/signup" element={<MainHome />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}
