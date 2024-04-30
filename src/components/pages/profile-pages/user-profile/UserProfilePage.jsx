import { React, useState, useEffect } from "react";
import "../ProfilePage.css";
import ProfileInfo from "../ProfileInfo";
import LoadingPage from "../../alert-pages/LoadingPage";
import ProfileActionsArea from "./ProfileActionsArea";
import { isSubscribed } from "../../../../axios/UserAPI";
import { useUserContext } from "../../../routes/UserRoute";
import { useAppContext } from "../../../../App";
import { Role } from "../../../../utils/Role";

export default function UserProfilePage() {

  const { user } = useAppContext();
  const { userProfile } = useUserContext();
  const [follow, setFollow] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSubscription() {
      let response = await isSubscribed(
        userUniqueName,
        subscriptionUniqueName
      )

      if (response?.data?.subscribed) {
        setFollow(true);
      } else {
        setFollow(false);
      }
    }
    let userUniqueName = user.uniqueName;
    let subscriptionUniqueName = userProfile.uniqueName;
    if (userUniqueName !== subscriptionUniqueName && userUniqueName !== "" && subscriptionUniqueName !== "" && user.role !== Role.ADMIN && user.role !== Role.ROOT) {
      checkSubscription();
    }
    setLoading(false);
  }, [userProfile, user]);

  return (
    isLoading
      ? <LoadingPage />
      : (
        <div className="profile-page">
          <ProfileInfo />
          <ProfileActionsArea follow={follow} setFollow={setFollow} />
        </div>
      )
  );
}