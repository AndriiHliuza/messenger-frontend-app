import { React, createContext, useContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { getUserByUniqueNameAndRole, getProfileImage, getProfileImageMetadata } from "../../axios/UserAPI"; 
import { Role } from "../../utils/Role";
import NotFoundPage from "../pages/alert-pages/NotFoundPage";
import LoadingPage from "../pages/alert-pages/LoadingPage";

export const RootContext = createContext();
export const useRootContext = () => useContext(RootContext);

export default function RootRoute() {

  const params = useParams();
  const [rootExists, setRootExists] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const [rootProfile, setRootProfile] = useState({
    username: "",
    registrationDate: "",
    uniqueName: "",
    firstname: "",
    lastname: "",
    birthday: "",
    role: "",
    profileImage: null
  });

  useEffect(() => {
    if (!params.uniqueName) {
      setRootExists(true);
    }
    async function checkUserExistence() {
      let profileDataResponse = null;
      let profileImageResponse = null;
      if (params.uniqueName) {
        profileDataResponse = await getUserByUniqueNameAndRole(params.uniqueName, Role.ROOT);
      }
      if (profileDataResponse !== null && profileDataResponse?.data?.uniqueName === params.uniqueName) {
        setRootExists(true);
        const { data } = profileDataResponse;

        profileImageResponse = await getProfileImage(data.uniqueName);
        let imageToSet = null;
        if (profileImageResponse?.data
          && profileImageResponse?.data?.type.startsWith("image/")
          && profileImageResponse?.data?.size !== 0) {

          let imageBytes = profileImageResponse.data;

          const profileImageMetadataResponse = await getProfileImageMetadata(data.uniqueName);
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

        setRootProfile({
          username: data.username,
          registrationDate: data.registrationDate,
          uniqueName: data.uniqueName,
          firstname: data.firstname,
          lastname: data.lastname,
          birthday: data.birthday,
          role: data.role,
          profileImage: imageToSet
        })
      }
      setLoading(false);
    }
    checkUserExistence();
  }, [params]);

  return (
    isLoading
      ? <LoadingPage />
      : rootExists
        ? (
          <RootContext.Provider value={{ rootProfile, setRootProfile }}>
            <Outlet />
          </RootContext.Provider>
        )
        : <NotFoundPage />
  );
}