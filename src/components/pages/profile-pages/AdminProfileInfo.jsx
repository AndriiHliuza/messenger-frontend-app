import { React } from "react";
import "./ProfileInfo.css";
import ProfileInfoItem from "./ProfileInfoItem";
import ProfileImageItem from "./ProfileImageItem";
import { useAdminContext } from "../../routes/AdminRoute";

export default function AdminProfileInfo() {

    const { adminProfile } = useAdminContext();

    return (
        <div className="profile-info">
            <div className="user-photo">
                <div className="user-photo-container">
                    <ProfileImageItem profileImage={adminProfile?.profileImage} />
                </div>
            </div>
            <div className="user-info">
                <div className="user-info-container">
                    <ProfileInfoItem
                        itemName="Username:"
                        itemValue={adminProfile.uniqueName ? adminProfile.uniqueName : "-"}
                    />
                    <ProfileInfoItem
                        itemName="First name:"
                        itemValue={adminProfile.firstname ? adminProfile.firstname : "-"}
                    />
                    <ProfileInfoItem
                        itemName="Last name:"
                        itemValue={adminProfile.lastname ? adminProfile.lastname : "-"}
                    />
                    <ProfileInfoItem
                        itemName="Birthday:"
                        itemValue={adminProfile.birthday ? adminProfile.birthday : "-"}
                    />
                </div>
            </div>
        </div>
    );
}