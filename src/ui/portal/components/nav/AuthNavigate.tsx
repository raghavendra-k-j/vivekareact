import { Navigate } from "react-router";

export function AuthNavigate() {
    return <Navigate to="/auth/login" replace={true} />;
}