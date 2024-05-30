import { React } from "react";
import AdminProfileInfo from "../AdminProfileInfo";
import AdminProfileActionsArea from "./AdminProfileActionsArea";

export default function AdminProfilePage() {

    return (
        <div className="profile-page">
            <AdminProfileInfo />
            <AdminProfileActionsArea />
        </div>
    );
}