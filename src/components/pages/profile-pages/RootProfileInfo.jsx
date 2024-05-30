import { React } from "react";
import "./ProfileInfo.css";
import ProfileInfoItem from "./ProfileInfoItem";
import ProfileImageItem from "./ProfileImageItem";
import { useRootContext } from "../../routes/RootRoute";

export default function RootProfileInfo() {

    const { rootProfile } = useRootContext();

    return (
        <div className="profile-info">
            <div className="user-photo">
                <div className="user-photo-container">
                    <ProfileImageItem profileImage={rootProfile?.profileImage} />
                </div>
            </div>
            <div className="user-info">
                <div className="user-info-container">
                    <ProfileInfoItem
                        itemName="Username:"
                        itemValue={rootProfile.uniqueName ? rootProfile.uniqueName : "-"}
                    />
                    <ProfileInfoItem
                        itemName="First name:"
                        itemValue={rootProfile.firstname ? rootProfile.firstname : "-"}
                    />
                    <ProfileInfoItem
                        itemName="Last name:"
                        itemValue={rootProfile.lastname ? rootProfile.lastname : "-"}
                    />
                    <ProfileInfoItem
                        itemName="Birthday:"
                        itemValue={rootProfile.birthday ? rootProfile.birthday : "-"}
                    />
                </div>
            </div>
        </div>
    );
}