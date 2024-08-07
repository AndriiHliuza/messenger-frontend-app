import { React, createContext, useContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { getUserByUniqueNameAndRole, getProfileImage, getProfileImageMetadata } from "../../axios/UserAPI";
import { Role } from "../../utils/Role";
import NotFoundPage from "../pages/alert-pages/NotFoundPage";
import LoadingPage from "../pages/alert-pages/LoadingPage";

export const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export default function UserRoute() {

  const params = useParams();
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const [userProfile, setUserProfile] = useState({
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
      setUserExists(true);
    }
    async function checkUserExistence() {
      let profileDataResponse = null;
      let profileImageResponse = null;
      if (params.uniqueName) {
        profileDataResponse = await getUserByUniqueNameAndRole(params.uniqueName, Role.USER);
      }
      if (profileDataResponse !== null && profileDataResponse?.data?.uniqueName === params.uniqueName) {
        setUserExists(true);
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

        setUserProfile({
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
      : userExists
        ? (
          <UserContext.Provider value={{ userProfile, setUserProfile }}>
            <Outlet />
          </UserContext.Provider>
        )
        : <NotFoundPage />
  );
}