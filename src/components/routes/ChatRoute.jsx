import { React } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NotFoundPage from "../pages/alert-pages/NotFoundPage";
import { CHATS_ROUTE } from "../../config";

export default function ChatRoute() {

    const location = useLocation();

    return (
            location.pathname !== CHATS_ROUTE
                ? <Outlet />
                : <NotFoundPage />
    );
}