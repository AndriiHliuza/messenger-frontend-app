import { React, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./HomePage.css";
import HomePageFooter from "./footer/HomePageFooter"
import { useAppContext } from "../../../App";
import { ADMIN_ROUTE, HOME_ROUTE, ROOT_ROUTE, USER_ROUTE } from "../../../config";
import homePageImg from "../../../images/homepage-img.png";
import { Role } from "../../../utils/Role";

export default function HomePage() {
    const { user } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user?.authenticated && location.pathname === HOME_ROUTE) {
            let userRole = user?.role;
            switch(userRole) {
                case Role.VISITOR:
                    navigate(HOME_ROUTE);
                    break;
                case Role.USER:
                    navigate(USER_ROUTE + "/" + user?.uniqueName);
                    break;
                case Role.ADMIN:
                    navigate(ADMIN_ROUTE + "/" + user?.uniqueName);
                    break;
                case Role.ROOT:
                    navigate(ROOT_ROUTE + "/" + user?.uniqueName);
                    break;
            }
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