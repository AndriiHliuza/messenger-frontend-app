import { React } from "react";
import { useParams } from "react-router-dom";

export default function UserProfilePage() {

  const params = useParams();

  return (
    <h1>Hello {params.uniqueName}</h1>
  );
}