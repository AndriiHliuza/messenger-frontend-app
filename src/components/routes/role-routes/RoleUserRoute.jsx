import { React, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../../utils/AuthProvider";
import { Role } from "../../../utils/Role";
import NotFoundPage from "../../pages/alert-pages/NotFoundPage";
import LoadingPage from "../../pages/alert-pages/LoadingPage";

export default function RoleUserRoute() {

    const { user } = useAuth();

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 300);
    }, []);

    return (
        isLoading
            ? <LoadingPage />
            : user?.role === Role.USER || user?.role === Role.ADMIN || user?.role === Role.ROOT
                ? <Outlet />
                : <NotFoundPage />
    );
}