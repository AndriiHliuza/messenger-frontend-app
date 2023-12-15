import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../utils/AuthProvider";
import { useProfile } from "../../../routes/UserRoute";
import "../ProfileModificationPage.css";
import { Form, Formik } from "formik";
import FormItem from "../../auth-pages/FormItem";
import { modificationSchema } from "../../../../utils/validation-schemas/ValidationSchemaConfig";
import LoadingPage from "../../alert-pages/LoadingPage";
import NotFoundPage from "../../alert-pages/NotFoundPage";
import { modify, getProfileImage, getProfileImageMetadata } from "../../../../axios/UserAPI";
import ImageItem from "../ImageItem";
import {
    USER_ROUTE
} from "../../../../config";

export default function ProfileModificationPage() {

    const { user, setUser } = useAuth();
    const { userProfile, setUserProfile } = useProfile();
    const [isLoading, setLoading] = useState(true);
    const [isModificationFailed, setModificationFailed] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setProfileImage(userProfile.profileImage);
        setTimeout(() => {
            setLoading(false);
        }, 300);
    }, []);

    const onSubmit = async (values, actions) => {

        let formData = new FormData();
        formData.append("currentPassword", values.currentPassword);
        formData.append("password", values.password);
        formData.append("uniqueName", values.uniqueName);
        formData.append("firstname", values.firstname);
        formData.append("lastname", values.lastname);
        formData.append("birthday", values.birthday);
        formData.append("userImage", profileImage)
        const userDataResponse = await modify(
            user.username,
            formData
        );

        if (userDataResponse?.data && userDataResponse?.data?.uniqueName) {
            let userProfileRoute = USER_ROUTE;
            const uniqueName = userDataResponse.data.uniqueName;
            const firstname = userDataResponse?.data?.firstname;
            const lastname = userDataResponse?.data?.lastname;
            const birthday = userDataResponse?.data?.birthday;

            const profileImageResponse = await getProfileImage(uniqueName);
            let imageToSet = null;
            if (profileImageResponse?.data
                && profileImageResponse?.data?.type.startsWith("image/")
                && profileImageResponse?.data?.size !== 0) {
                let imageBytes = profileImageResponse?.data;

                const profileImageMetadataResponse = await getProfileImageMetadata(uniqueName);

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

            setModificationFailed(false);
            setUser({
                ...user,
                uniqueName: uniqueName
            });
            setProfileImage(imageToSet);
            setUserProfile({
                ...userProfile,
                uniqueName: uniqueName,
                firstname: firstname,
                lastname: lastname,
                birthday: birthday,
                profileImage: imageToSet
            });
            navigate(userProfileRoute + "/" + uniqueName);
        } else {
            setModificationFailed(true);
        }
    }

    return (
        isLoading
            ? <LoadingPage />
            : user.username === userProfile.username
                ? (
                    <Formik
                        initialValues={{
                            uniqueName: userProfile.uniqueName,
                            password: "",
                            firstname: userProfile.firstname,
                            lastname: userProfile.lastname,
                            birthday: userProfile.birthday,
                            currentPassword: ""
                        }}
                        validationSchema={modificationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting }) => (
                            <div className="profile-modification-page-container">
                                <div className="profile-modification-form">
                                    <h1>Modify Account</h1>
                                    <Form>
                                        <ImageItem profileImage={profileImage} setProfileImage={setProfileImage} />
                                        <FormItem
                                            label="Username:"
                                            id="uniqueName"
                                            name="uniqueName"
                                            type="text"
                                            placeholder={userProfile.uniqueName}
                                        />
                                        <FormItem
                                            label="Password:"
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="3245!mySuperSecurePassword$8976"
                                        />
                                        <FormItem
                                            label="First name:"
                                            id="firstname"
                                            name="firstname"
                                            type="text"
                                            placeholder={userProfile.firstname}
                                        />
                                        <FormItem
                                            label="Last name:"
                                            id="lastname"
                                            name="lastname"
                                            type="text"
                                            placeholder={userProfile.lastname}
                                        />
                                        <FormItem
                                            label="Birthday:"
                                            id="birthday"
                                            name="birthday"
                                            type="date"
                                            placeholder="20.12.2022"
                                        />
                                        <hr />
                                        <div className="modification-explanation-text">You need to provide your current password for this operation</div>
                                        <FormItem
                                            label="Current password:"
                                            id="currentPassword"
                                            name="currentPassword"
                                            type="password"
                                            placeholder="3245!mySuperSecurePassword$8976"
                                        />
                                        <button disabled={isSubmitting} type="submit">Modify</button>
                                    </Form>
                                    <div className={isModificationFailed ? "modification-failded-message" : "inactive-block"}>Something went wrong! Try to check all the fields! Note: If you are changing username, it may already be in use by someone else!</div>
                                </div>
                            </div>
                        )}
                    </Formik>
                )
                : <NotFoundPage />
    );
}