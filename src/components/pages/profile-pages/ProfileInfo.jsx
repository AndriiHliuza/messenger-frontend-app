import { React } from "react";
import "./ProfileInfo.css";
import ProfileInfoItem from "./ProfileInfoItem";
import { useProfile } from "../../routes/UserRoute";
import ProfileImageItem from "./ProfileImageItem";

export default function UserInfo(props) {

    const { userProfile } = useProfile();

    return (
        <div className="profile-info">
            <div className="user-photo">
                <div className="user-photo-container">
                    <ProfileImageItem profileImage={userProfile?.profileImage} />
                </div>
            </div>
            <div className="user-info">
                <div className="user-info-container">
                    <ProfileInfoItem
                        itemName="Username:"
                        itemValue={userProfile.uniqueName ? userProfile.uniqueName : "-"}
                    />
                    <ProfileInfoItem
                        itemName="First name:"
                        itemValue={userProfile.firstname ? userProfile.firstname : "-"}
                    />
                    <ProfileInfoItem
                        itemName="Last name:"
                        itemValue={userProfile.lastname ? userProfile.lastname : "-"}
                    />
                    <ProfileInfoItem
                        itemName="Birthday:"
                        itemValue={userProfile.birthday ? userProfile.birthday : "-"}
                    />
                </div>
            </div>
        </div>
    );
}