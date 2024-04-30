import { React } from "react";
import RootProfileInfo from "../RootProfileInfo";
import RootProfileActionsArea from "./RoorProfileActionsArea";

export default function RootProfilePage() {

    return (
        <div className="profile-page">
            <RootProfileInfo />
            <RootProfileActionsArea />
        </div>
    );
}