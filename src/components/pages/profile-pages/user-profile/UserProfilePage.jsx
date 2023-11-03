import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserByUniqueName } from "../../../../axios/UserAPI"
import NotFoundPage from "../../alert-pages/NotFoundPage";

export default function UserProfilePage() {

  const params = useParams();
  const [isUserExists, setUserExists] = useState(false);

  useEffect(() => {
    async function checkUserExistence() {
      let response = await getUserByUniqueName(params.uniqueName);
      if (response?.data?.uniqueName === params.uniqueName) {
        setUserExists(true);
      }
    }
    checkUserExistence();
  });

  return (
    isUserExists
      ? <h1>Hello {params.uniqueName}</h1>
      : <NotFoundPage />
  );
}