import { React } from "react";
import { useNavigate } from "react-router-dom";
import "../ProfilePage.css";
import { deleteAdmin } from "../../../../axios/AdminAPI";
import {
    ADMIN_ROUTE,
    HOME_ROUTE
} from "../../../../config";
import { useAppContext } from "../../../../App";
import { Role } from "../../../../utils/Role";
import { useAdminContext } from "../../../routes/AdminRoute";

export default function AdminProfileActionsArea() {

    const { user, setUser, setInformMessage } = useAppContext();
    const { adminProfile } = useAdminContext();
    const navigate = useNavigate();

    const modifyAccount = async () => {
        let userProfileRoute = ADMIN_ROUTE;
        const uniqueName = user.uniqueName;
        navigate(userProfileRoute + "/" + uniqueName + "/account");
    }

    const deleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your accout?")) {
            let response = await deleteAdmin(adminProfile?.username);
            let data = response?.data;
            if (data && user?.role === Role.ADMIN) {
                navigate(HOME_ROUTE);
                setUser({
                    username: "",
                    uniqueName: "",
                    authenticated: false,
                    role: Role.VISITOR
                });
                localStorage.clear();
                setInformMessage("Account was deleted");
            } else if (data && user?.role === Role.ROOT) {
                navigate(ADMIN_ROUTE);
                setInformMessage("Account was deleted");
            }
        }
    }

    return (
        <div className="profile-actions-area">
            <div className="profile-actions-panel">
                {
                    user?.role === Role.ADMIN
                        ? <>
                            <div className={user.username === adminProfile.username ? "profile-button modify-account-button" : "hide-button"} onClick={modifyAccount}>Modify Account</div>
                            <div className={user.username === adminProfile.username ? "profile-button modify-account-button delete-admin-account-button delete-account-button-color" : "hide-button"} onClick={deleteAccount}>Delete Account</div>
                        </>
                        : <div className="profile-button modify-account-button delete-admin-account-button-for-root delete-account-button-color" onClick={deleteAccount}>Delete Account</div>
                }

            </div>
        </div>
    );
}