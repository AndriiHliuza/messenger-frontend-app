import React from "react";
import "./HomePageFooter.css";

export default function HomePageFooter() {
    return (
        <footer>
            <div className="footer-container">
                <div className="footer-item">
                    <div className="footer-item-content">
                        <h4>About</h4>
                        <div>Messenger</div>
                    </div>
                </div>
                <div className="footer-item">
                    <div className="footer-item-content">
                        <h4>Contact</h4>
                        <div>
                            <a
                                href="https://github.com/AndriiHliuza"
                                target=">blank"
                                className="footer-contact-link"
                            >
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}