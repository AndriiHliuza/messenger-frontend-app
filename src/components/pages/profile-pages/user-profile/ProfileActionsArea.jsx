import { React } from "react";
import { useNavigate } from "react-router-dom";
import "../ProfilePage.css";
import { useAuth } from "../../../../utils/AuthProvider";
import { useProfile } from "../../../routes/UserRoute";
import { subscribe, unsubscribe } from "../../../../axios/UserAPI";
import {  
    USER_ROUTE
} from "../../../../config";

export default function ProfileActionsArea(props) {

    const { user } = useAuth();
    const { userProfile } = useProfile();
    const { follow, setFollow } = props;
    const navigate = useNavigate();

    const onFollowClick = async () => {
        let authenticatedUserUniqueName = user.uniqueName;
        let userToFollowUniqueName = userProfile.uniqueName;
        let response = null;
        if (follow) {
            response = await unsubscribe(
                authenticatedUserUniqueName,
                userToFollowUniqueName
            )
        } else {
            response = await subscribe(
                authenticatedUserUniqueName,
                userToFollowUniqueName
            );
        }

        if (response?.data?.subscribed) {
            setFollow(true);
        } else {
            setFollow(false);
        }
    }

    const onSubscriptionsButtonClick = () => {
        let userProfileRoute = USER_ROUTE;
        const uniqueName = userProfile.uniqueName;
        navigate(userProfileRoute + "/" + uniqueName + "/subscriptions");
    }

    const onSubscribersButtonClick = () => {
        let userProfileRoute = USER_ROUTE;
        const uniqueName = userProfile.uniqueName;
        navigate(userProfileRoute + "/" + uniqueName + "/subscribers");
    }

    const modifyAccount = () => {
        let userProfileRoute = USER_ROUTE;
        const uniqueName = user.uniqueName;
        navigate(userProfileRoute + "/" + uniqueName + "/account");
    }

    return (
        <div className="profile-actions-area">
            <div className="profile-actions-panel">
                <div className={user.username === userProfile.username ? "profile-button modify-account-button" : "hide-button"} onClick={modifyAccount}>Modify Account</div>
                <div className={user.username !== userProfile.username ? "profile-button follow-button" : "hide-button"} onClick={onFollowClick}>{follow ? "Unsubscribe" : "Subscribe"}</div>
                <div className={user.username !== userProfile.username ? "profile-button message-button" : "hide-button"}>Write message</div>
            </div>
            <div className="profile-subscriptions-area">
                <div className="profile-button subscribtions-button" onClick={onSubscriptionsButtonClick}>Subscriptions</div>
                <div className="profile-button subscribers-button" onClick={onSubscribersButtonClick}>Subscribers</div>
            </div>
        </div>
    );
}