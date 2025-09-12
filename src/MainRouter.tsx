import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { PageLoader } from "./ui/components/loaders/PageLoader";


const MainHome = lazy(() => import("./ui/main/home/HomePage"));
const WebPage = lazy(() => import("./ui/main/webpage/WebPage"));
const LoginPage = lazy(() => import("./ui/main/auth/login/LoginPage"));
const ProductsPage = lazy(() => import("./ui/main/home/ProductsPage"));
const NotFoundPage = lazy(() => import("./ui/main/error/MainNotFoundPage"));
const SignUpPage = lazy(() => import("./ui/main/auth/signup/SignUpPage"));
const MainLayout = lazy(() => import("./ui/main/layout/MainLayout"));

export default function Router() {
    return (
        <Suspense fallback={<div className="h-full bg-brand-gradient"><PageLoader /></div>}>
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
