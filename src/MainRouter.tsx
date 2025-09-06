import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { PageLoader } from "./ui/components/loaders/PageLoader";


const MainHome = lazy(() => import("./ui/pages/main/home/HomePage"));
const WebPage = lazy(() => import("./ui/pages/main/webpage/WebPage"));
const LoginPage = lazy(() => import("./ui/pages/main/home/LoginPage"));
const ProductsPage = lazy(() => import("./ui/pages/main/home/ProductsPage"));
const NotFoundPage = lazy(() => import("./ui/pages/main/error/MainNotFoundPage"));
const SignUpPage = lazy(() => import("./ui/pages/main/auth/signup/SignUpPage"));
const MainLayout = lazy(() => import("./ui/pages/main/layout/MainLayout"));

export default function Router() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index element={<MainHome />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/pages/:slug" element={<WebPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
