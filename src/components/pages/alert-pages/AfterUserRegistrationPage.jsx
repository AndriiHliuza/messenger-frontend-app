import { React } from "react";
import "./AlertPage.css";
import { useAppContext } from "../../../App";
import { sendEmailForUserAccountActivation } from "../../../axios/EmailAPI";

export default function AfteruserRegistrationPage() {

    const { setInformMessage } = useAppContext();

    const onSendCodeButtonClick = async () => {
        let registratingUserEmail = localStorage.getItem("registratingUserEmail")
        if (registratingUserEmail) {
            let response = await sendEmailForUserAccountActivation(registratingUserEmail);
            let data = response?.data;
            if (data) {
                setInformMessage("Code was sent to " + registratingUserEmail);
            }
        } else {
            setInformMessage("Email is unknown");
        }
    }


    return (
        <div className="alert-page">
            <div className="alert-container after-user-registration-element">
                <h1>Check your email to activate account</h1>
                <div>Click the below button if you have not received an activation letter</div>
                <div className="after-user-registration-send-code-button-container">
                    <div onClick={onSendCodeButtonClick} className="after-user-registration-send-code-button">Send code again</div>
                </div>
            </div>
        </div>
    );
}