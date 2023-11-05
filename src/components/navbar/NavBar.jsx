import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { faMessage, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./NavBar.css";
import {
    HOME_ROUTE,
    ABOUT_ROUTE,
    CONTACT_ROUTE,
    SIGH_IN_ROUTE,
    SIGN_UP_ROUTE,
    USER_ROUTE,
    ADMIN_ROUTE,
    ROOT_ROUTE
} from "../../config";
import { useAuth } from "../../utils/AuthProvider";
import { logout } from "../../axios/AuthAPI";
import { Role } from "../../utils/Role";

export default function NavBar() {

    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { name: "Home", href: HOME_ROUTE },
        { name: "About", href: ABOUT_ROUTE },
        { name: "Contact", href: CONTACT_ROUTE }
    ];

    const [itemsToShow, setItemsToShow] = useState([]);

    useEffect(() => {
        let userProfileRoute = USER_ROUTE;
        let role = user.role;
        switch (role) {
            case Role.USER:
                userProfileRoute = USER_ROUTE;
                break;
            case Role.ADMIN:
                userProfileRoute = ADMIN_ROUTE;
                break;
            case Role.ROOT:
                userProfileRoute = ROOT_ROUTE;
                break;
            default :
                userProfileRoute = USER_ROUTE;
        }


        if (user.authenticated) {
            const uniqueName = user.uniqueName;
            setItemsToShow([
                ...items,
                { name: "Profile", href: userProfileRoute + "/" + uniqueName }
            ]);
        } else {
            setItemsToShow([
                ...items,
                { name: "Sign In", href: SIGH_IN_ROUTE },
                { name: "Sign Up", href: SIGN_UP_ROUTE }
            ]);
        }
    }, [user])

    const [menuButtonClick, setMenuButtonClick] = useState(false);

    const handleMenuButtonClick = () => setMenuButtonClick(!menuButtonClick);
    const onNavItemClick = (e) => setMenuButtonClick(false);

    const onLogOut = async () => {
        let logoutConfirmed = window.confirm("Do you want to log out?")
        if (logoutConfirmed) {
            await logout();
            setUser({
                username: "",
                uniqueName: "",
                authenticated: false,
                role: Role.VISITOR
            }); 
            navigate(HOME_ROUTE);
        }
    }

    return (
        <header>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo" onClick={onNavItemClick}>
                        <FontAwesomeIcon icon={faMessage} className="navbar-logo-img" />
                        <h1>WebTalk</h1>
                    </Link>
                    <div className="nav-menu">
                        <div className={menuButtonClick ? "nav-items items-sm" : "nav-items"}>
                            {itemsToShow.map(item => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) => {
                                        return isActive && (location.pathname === item.href) ? "nav-item active-item" : "nav-item"
                                    }}
                                    onClick={onNavItemClick}>
                                    {item.name}
                                </NavLink>
                            ))}
                            {
                                user.authenticated &&
                                <div className="logout-button-container">
                                    <div className="logout-button" onClick={onLogOut}>Log Out</div>
                                </div>

                            }
                        </div>
                        <div className="menu-toggler-button" onClick={handleMenuButtonClick}>
                            {
                                menuButtonClick ? (
                                    <FontAwesomeIcon icon={faXmark} className="menu-icon" />
                                ) : (
                                    <FontAwesomeIcon icon={faBars} className="menu-icon" />
                                )
                            }
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}