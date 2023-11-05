import { React } from "react";
import { useParams } from "react-router-dom";

export default function AdminProfilePage() {

    const params = useParams();

    return (
        <h1>Hello admin {params.uniqueName}</h1>
    );
}