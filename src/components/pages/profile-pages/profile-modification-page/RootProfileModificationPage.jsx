import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../ProfileModificationPage.css";
import { Form, Formik } from "formik";
import FormItem from "../../auth-pages/FormItem";
import "../../auth-pages/FormItem.css";
import { adminModificationSchema } from "../../../../utils/validation-schemas/ValidationSchemaConfig";
import LoadingPage from "../../alert-pages/LoadingPage";
import NotFoundPage from "../../alert-pages/NotFoundPage";
import { modify, getProfileImage, getProfileImageMetadata } from "../../../../axios/UserAPI";
import ImageItem from "../ImageItem";
import { ROOT_ROUTE } from "../../../../config";
import { useAppContext } from "../../../../App";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRootContext } from "../../../routes/RootRoute";

export default function RootProfileModificationPage() {

    const { user, setUser } = useAppContext();
    const { rootProfile, setRootProfile } = useRootContext();
    const [isLoading, setLoading] = useState(true);
    const [isModificationFailed, setModificationFailed] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [rootProfileBirthday, setRootProfileBirthday] = useState("");
    const [isBirthdayValid, setBirthdayValid] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setProfileImage(rootProfile.profileImage);
        if (rootProfile.birthday === null) {
            setRootProfileBirthday("");
        } else {
            setRootProfileBirthday(rootProfile.birthday);
        }
        setLoading(false);    
    }, []);

    const setBirthday = (e) => {
        let birthdayValue = e.target.value;
        if (birthdayValue !== null && birthdayValue !== "") {
            let birthdayFromInput = new Date(birthdayValue);
            let currentDate = new Date();
            if (birthdayFromInput > currentDate) {
                setBirthdayValid(false);
            } else {
                setBirthdayValid(true);
            }
        } else {
            setBirthdayValid(true);
        }
        setRootProfileBirthday(birthdayValue);
    }

    const onSubmit = async (values, actions) => {

        let formData = new FormData();
        formData.append("currentPassword", values.currentPassword);
        formData.append("password", values.password);
        formData.append("uniqueName", values.uniqueName);
        formData.append("firstname", values.firstname);
        formData.append("lastname", values.lastname);
        formData.append("birthday", rootProfileBirthday);
        formData.append("userImage", profileImage)
        const rootDataResponse = await modify(
            user.username,
            formData
        );

        if (rootDataResponse?.data && rootDataResponse?.data?.uniqueName) {
            let rootProfileRoute = ROOT_ROUTE;
            const uniqueName = rootDataResponse.data.uniqueName;
            const firstname = rootDataResponse?.data?.firstname;
            const lastname = rootDataResponse?.data?.lastname;
            const birthday = rootDataResponse?.data?.birthday;

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
            setRootProfile({
                ...rootProfile,
                uniqueName: uniqueName,
                firstname: firstname,
                lastname: lastname,
                birthday: birthday,
                profileImage: imageToSet
            });
            navigate(rootProfileRoute + "/" + uniqueName);
        } else {
            setModificationFailed(true);
        }
    }

    return (
        isLoading
            ? <LoadingPage />
            : user.username === rootProfile.username
                ? (
                    <Formik
                        initialValues={{
                            uniqueName: rootProfile.uniqueName,
                            password: "",
                            firstname: rootProfile.firstname,
                            lastname: rootProfile.lastname,
                            currentPassword: ""
                        }}
                        validationSchema={adminModificationSchema}
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
                                            placeholder={rootProfile.uniqueName}
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
                                            placeholder={rootProfile.firstname}
                                        />
                                        <FormItem
                                            label="Last name:"
                                            id="lastname"
                                            name="lastname"
                                            type="text"
                                            placeholder={rootProfile.lastname}
                                        />
                                        <div className="formItem">
                                            <label htmlFor="birthday">Birthday:</label>
                                            <input
                                                id="birthday"
                                                name="birthday"
                                                type="date"
                                                value={rootProfileBirthday}
                                                onChange={setBirthday}
                                            />
                                            <div className={!isBirthdayValid ? "display-item-error-validation-message" : "hide-item-error-validation-message"}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                <span className="item-error-message">{`Date needs to be before ${new Date()}`}</span>
                                            </div>
                                        </div>
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