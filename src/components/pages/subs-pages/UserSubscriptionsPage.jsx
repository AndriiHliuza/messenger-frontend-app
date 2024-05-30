import { React, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { getUserSubscriptions } from "../../../axios/UserAPI";
import "./SubsPages.css";
import LoadingPage from "../alert-pages/LoadingPage";
import SubsPagesUserItem from "./SubsPagesUserItem";
import { useUserContext } from "../../routes/UserRoute";

export default function UserSubscriptionsPage() {

    const { userProfile }  = useUserContext();
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        async function getSubscriptions() {
            if (userProfile?.username) {
                let response = await getUserSubscriptions(params.uniqueName);
                let data = response?.data;
                if (data) {
                    setSubscriptions(data);
                }
            }
            setLoading(false);
        }
        getSubscriptions();
    }, []);

    return (
        isLoading
            ? <LoadingPage />
            : <div className="subs-page-container">
                <div className="subs-page">
                    {
                        subscriptions.length !== 0
                            ? subscriptions.map((subscription) => {
                                return <SubsPagesUserItem key={subscription?.username} user={subscription} />
                            })
                            : <h1>No subscriptions found</h1>
                    }
                </div>
            </div>
    );
}