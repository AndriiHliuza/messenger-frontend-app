import React from "react";
import "./HomePage.css";
import HomePageFooter from "./footer/HomePageFooter"

export default function HomePage() {
    return (
        <div className='content'>
            <div className="content-message">
                <h1>Welcome to WebTalk</h1>
                <strong>WebTalk is a social network <br />which allows you to share your thoughts with others around the world</strong>
            </div>
            <HomePageFooter />
        </div >
    );
}