import { React, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./ProfileModificationPage.css"
import ProfileImageItem from "./ProfileImageItem";

export default function ImageItem(proprs) {

    const onRemoveProfileImgClick = () => {
        proprs.setProfileImage(null);
    }

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length && acceptedFiles[0].type.startsWith("image/")) {
            proprs.setProfileImage(Object.assign(acceptedFiles[0], { preview: URL.createObjectURL(acceptedFiles[0]) }));
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": []
        },
        maxSize: 1024 * 1000,
        multiple: false
    });

    return (
        <div className="profile-img">
            <div {...getRootProps({
                className: "profile-img-container"
            })} >
                <input {...getInputProps({
                    accept: "image/*"
                })} />
                <ProfileImageItem profileImage={proprs?.profileImage} />
            </div>
            <div onClick={onRemoveProfileImgClick} className={proprs.profileImage ? "remove-profile-img-button" : "inactive-block"}>Remove image</div>
        </div>
    );
}