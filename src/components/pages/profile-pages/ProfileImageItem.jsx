import { React } from "react";
import defaultProfileImg from "../../../images/default-profile-img.jpg";
import "./ProfileInfo.css";

export default function ProfileImageItem(props) {
    return (
        props?.profileImage
            ? <img src={props.profileImage.preview} className="uploaded-user-photo" />
            : <img src={defaultProfileImg} className="uploaded-user-photo" />
    );
}