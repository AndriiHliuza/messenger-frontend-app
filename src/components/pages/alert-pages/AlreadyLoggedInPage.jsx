import { React } from "react";
import "./AlertPage.css";

export default function AlreadyLoggedIn() {

    return (
        <div className="alert-page">
            <div className="alert-container">
                <h1>You are already signed in</h1>
            </div>
        </div>
    );
}