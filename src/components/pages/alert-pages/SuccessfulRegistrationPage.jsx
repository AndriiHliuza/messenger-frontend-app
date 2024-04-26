import { React } from "react";
import "./AlertPage.css";
import { SIGH_IN_ROUTE } from "../../../config"; 
import { Link } from "react-router-dom";

export default function SuccessfulRegistrationPage() {

    return (
        <div className="alert-page">
            <div className="alert-container successful-registration-element">
                <h1>Registration successful</h1>
                <div className="alert-explanation-text">
                    <span className="sign-item-text">Please sign in to continue</span>
                    <Link to={SIGH_IN_ROUTE}>Sign In</Link>
                </div>
            </div>
        </div>
    );
}