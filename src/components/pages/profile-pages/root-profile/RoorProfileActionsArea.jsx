import { React } from "react";
import { useNavigate } from "react-router-dom";
import "../ProfilePage.css";
import { useAppContext } from "../../../../App";
import { useRootContext } from "../../../routes/RootRoute";
import { ROOT_ROUTE } from "../../../../config";

export default function RootProfileActionsArea() {

    const { user } = useAppContext();
    const { rootProfile } = useRootContext();
    const navigate = useNavigate();

    const modifyAccount = async () => {
        let userProfileRoute = ROOT_ROUTE;
        const uniqueName = user.uniqueName;
        navigate(userProfileRoute + "/" + uniqueName + "/account");
    }

    return (
        <div className="profile-actions-area">
            <div className="profile-actions-panel">
                <div className={user.username === rootProfile.username ? "profile-button modify-root-account-button" : "hide-button"} onClick={modifyAccount}>Modify Account</div>
            </div>
        </div>
    );
}