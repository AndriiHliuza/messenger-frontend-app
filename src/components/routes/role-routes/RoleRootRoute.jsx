import { React } from "react";
import { Outlet } from 'react-router-dom';
import { Role } from "../../../utils/Role";
import NotFoundPage from "../../pages/alert-pages/NotFoundPage";
import { useAppContext } from "../../../App";

export default function RoleRootRoute() {

    const { user } = useAppContext();

    return (
        user?.role === Role.ROOT
            ? <Outlet />
            : <NotFoundPage />
    );
}