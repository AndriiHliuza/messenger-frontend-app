import { React, useEffect, forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USER_ROUTE } from "../config";
import "./UsersListItem.css";
import { getProfileImage, getProfileImageMetadata } from "../axios/UserAPI";
import ProfileImageItem from "./pages/profile-pages/ProfileImageItem";

const UsersListItem = forwardRef((props, ref) => {

    const { user } = props;

    const navigate = useNavigate();
    const [usersListItemImage, setUsersListItemImage] = useState(null);

    const onVisitAccountClick = () => {
        navigate(USER_ROUTE + "/" + user.uniqueName);
    }

    useEffect(() => {
        async function getUsersListItemImage() {
            const profileImageResponse = await getProfileImage(user.uniqueName);
            let imageToSet = null;
            if (profileImageResponse?.data
                && profileImageResponse?.data?.type.startsWith("image/")
                && profileImageResponse?.data?.size !== 0) {

                let imageBytes = profileImageResponse.data;

                const profileImageMetadataResponse = await getProfileImageMetadata(user.uniqueName);
                if (profileImageMetadataResponse?.data) {
                    const imageMetadata = profileImageMetadataResponse.data;

                    const imageName = imageMetadata.name;
                    const imageType = imageMetadata.type;
                    const imageUsername = imageMetadata.username;
                    const imageBlob = new Blob([imageBytes], { type: imageType });
                    imageToSet = Object.assign(
                        imageBlob,
                        {
                            preview: URL.createObjectURL(imageBlob),
                            name: imageName,
                            username: imageUsername
                        }
                    );
                }
            }
            setUsersListItemImage(imageToSet);
        }
        getUsersListItemImage();
    }, []);

    return (
        <div ref={ref} className="users-list-item">
            <div className="users-list-item-container">
                <div className="user-item-photo">
                    <div className="user-item-photo-container">
                        <ProfileImageItem profileImage={usersListItemImage} />
                    </div>
                </div>
                <div className="user-item-info">
                    <div className="user-item-info-container">
                        <div className="user-item-info-headline">Username:</div>
                        <div>{user.uniqueName}</div>
                        <div className="user-item-info-headline">Firstname:</div>
                        <div>{user.firstname}</div>
                        <div className="user-item-info-headline">Lastname:</div>
                        <div>{user.lastname}</div>
                        <div className="user-item-info-headline">Birthday:</div>
                        <div>{user.birthday ? user.birthday : "-"}</div>
                        <div className="visit-account-button" onClick={onVisitAccountClick}>Visit account</div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default UsersListItem;