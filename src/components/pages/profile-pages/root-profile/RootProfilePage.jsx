import { React } from "react";
import { useParams } from "react-router-dom";

export default function RootProfilePage() {

    const params = useParams();

    return (
        <h1>Hello root {params.uniqueName}</h1>
    );
}