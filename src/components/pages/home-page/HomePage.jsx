import { React, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./HomePage.css";
import HomePageFooter from "./footer/HomePageFooter"
import { useAppContext } from "../../../App";
import { HOME_ROUTE, USER_ROUTE } from "../../../config";
import homePageImg from "../../../images/homepage-img.png";

export default function HomePage() {
    const { user } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user?.authenticated && location.pathname === HOME_ROUTE) {
            navigate(USER_ROUTE + "/" + user?.uniqueName);
        }
    }, [user, location.pathname]);

    return (
        <div className='content'>
            <div className="content-message">
                <h1>Welcome to WebTalk</h1>
                <strong>WebTalk is a safe messenger <br />which allows you to share your thoughts with others around the world</strong>
            </div>
            <img className="home-page-img" src={homePageImg} alt="Responsive Image" />
            <HomePageFooter />
        </div >
    );
}