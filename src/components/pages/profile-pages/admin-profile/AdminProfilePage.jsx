import { React } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../../App";

export default function AdminProfilePage() {

    const params = useParams();
    const { user } = useAppContext();

    return (
        <div>
            <div>{user.username}</div>
            <div>{user.uniqueName}</div>
        </div>
    );
}