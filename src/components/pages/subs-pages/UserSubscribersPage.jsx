import { React, useState, useEffect } from "react";
import { useAppContext } from "../../../App";
import { getUserSubscribers } from "../../../axios/UserAPI";
import "./SubsPages.css";
import SubsPagesUserItem from "./SubsPagesUserItem";
import LoadingPage from "../alert-pages/LoadingPage";

export default function UserSubscribersPage() {

    const { user } = useAppContext();
    const [subscribers, setSubscribers] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function getSubscribers() {
            if (user?.username) {
                let response = await getUserSubscribers(user.username);
                let data = response?.data;
                if (data) {
                    setSubscribers(data);
                }
            }
            setLoading(false);
        }
        getSubscribers();
    }, []);

    return (
        isLoading
            ? <LoadingPage />
            : <div className="subs-page-container">
                <div className="subs-page">
                    {
                        subscribers.length !== 0
                            ? subscribers.map((subscriber) => {
                                return <SubsPagesUserItem key={subscriber?.username} user={subscriber} />
                            })
                            : <h1>You have no subscribers</h1>
                    }
                </div>
            </div>
    );
}