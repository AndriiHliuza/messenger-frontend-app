import { React, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { getUserByUniqueNameAndRole } from "../../axios/UserAPI"; 
import { Role } from "../../utils/Role";
import NotFoundPage from "../pages/alert-pages/NotFoundPage";
import LoadingPage from "../pages/alert-pages/LoadingPage";

export default function UserRoute() {

  const params = useParams();
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUserExistence() {
      let response = await getUserByUniqueNameAndRole(params.uniqueName, Role.USER);
      if (response?.data?.uniqueName === params.uniqueName) {
        setUserExists(true);
      }
      setLoading(false);
    }
    checkUserExistence();
  });

  return (
    isLoading
      ? <LoadingPage />
      : userExists
        ? <Outlet />
        : <NotFoundPage />
  );
}