import { React } from "react";
import { Outlet } from 'react-router-dom';
import { useAuth } from "../../utils/AuthProvider";
import NotFoundPage from "../pages/alert-pages/NotFoundPage";

export default function AdminRoute() {

    const { user } = useAuth();

    return (
        user?.role === "ADMIN"
            ? <Outlet />
            : <NotFoundPage />
    );
}