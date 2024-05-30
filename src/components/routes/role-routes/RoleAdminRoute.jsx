import { React } from "react";
import { Outlet } from 'react-router-dom';
import { Role } from "../../../utils/Role";
import NotFoundPage from "../../pages/alert-pages/NotFoundPage";
import { useAppContext } from "../../../App";

export default function RoleAdminRoute() {

    const { user } = useAppContext();

    return (
        user?.role === Role.ADMIN || user?.role === Role.ROOT
            ? <Outlet />
            : <NotFoundPage />
    );
}