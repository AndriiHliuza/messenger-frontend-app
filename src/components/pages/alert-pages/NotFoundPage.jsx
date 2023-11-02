import { React } from "react";
import "./AlertPage.css";

export default function NotFoundPage() {

    return (
        <div className="alert-page">
            <div className="alert-container">
                <h1>Page not found</h1>
                <div className="alert-explanation-text">We're sorry, but the page you are requesting cannot be found.</div>
            </div>
        </div>
    );
}