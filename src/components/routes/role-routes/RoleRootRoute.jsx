import { React, useState, useEffect } from "react";
import { Outlet } from 'react-router-dom';
import { Role } from "../../../utils/Role";
import NotFoundPage from "../../pages/alert-pages/NotFoundPage";
import LoadingPage from "../../pages/alert-pages/LoadingPage";
import { useAppContext } from "../../../App";

export default function RoleRootRoute() {

    const { user } = useAppContext();

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 150);
    }, []);

    return (
        isLoading
            ? <LoadingPage />
            : user?.role === Role.ROOT
                ? <Outlet />
                : <NotFoundPage />
    );
}