import { React, useState, useEffect } from "react";
import { useAppContext } from "../../../App";
import { getUserSubscriptions } from "../../../axios/UserAPI";
import "./SubsPages.css";
import LoadingPage from "../alert-pages/LoadingPage";
import SubsPagesUserItem from "./SubsPagesUserItem";

export default function UserSubscriptionsPage() {

    const { user } = useAppContext();
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function getSubscriptions() {
            if (user?.username) {
                let response = await getUserSubscriptions(user.username);
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
                            : <h1>You have no subscriptions</h1>
                    }
                </div>
            </div>
    );
}