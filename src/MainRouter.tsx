import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { PageLoader } from "./ui/components/loaders/PageLoader";
import NotFoundPage from "./ui/pages/error/NotFoundPage";



const MainHome = lazy(() => import("./ui/pages/main/home/HomePage"));
const SignUpPage = lazy(() => import("./ui/pages/main/auth/signup/SignUpPage"));
const MainLayout = lazy(() => import("./ui/pages/main/layout/MainLayout"));

export default function Router() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index element={<MainHome />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
