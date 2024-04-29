import { React, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Role } from "../../../utils/Role";
import NotFoundPage from "../../pages/alert-pages/NotFoundPage";
import { useAppContext } from "../../../App";

export default function RoleUserRoute() {

    const { user } = useAppContext();

    return (
            user?.role === Role.USER || user?.role === Role.ADMIN || user?.role === Role.ROOT
                ? <Outlet />
                : <NotFoundPage />
    );
}