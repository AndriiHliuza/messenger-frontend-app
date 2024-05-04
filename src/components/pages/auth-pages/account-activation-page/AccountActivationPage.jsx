import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../AuthPages.css";
import { useAppContext } from "../../../../App";
import { activateUserAccount } from "../../../../axios/AuthAPI";
import { SIGH_IN_ROUTE } from "../../../../config";

export default function AccountActivationPage() {
    
    const { setInformMessage } = useAppContext();
    const navigate = useNavigate();

    const [digit1, setDigit1] = useState("");
    const [digit2, setDigit2] = useState("");
    const [digit3, setDigit3] = useState("");
    const [digit4, setDigit4] = useState("");
    const [digit5, setDigit5] = useState("");
    const [digit6, setDigit6] = useState("");

    const handleChangeDigit1 = (event) => setDigit1(event.target.value.substring(0, 1));
    const handleChangeDigit2 = (event) => setDigit2(event.target.value.substring(0, 1));
    const handleChangeDigit3 = (event) => setDigit3(event.target.value.substring(0, 1));
    const handleChangeDigit4 = (event) => setDigit4(event.target.value.substring(0, 1));
    const handleChangeDigit5 = (event) => setDigit5(event.target.value.substring(0, 1));
    const handleChangeDigit6 = (event) => setDigit6(event.target.value.substring(0, 1));

    const onConfirmAccountActivationButtonClick = async () => {
        if (digit1 && digit2 && digit3 && digit4 && digit5 && digit6) {
            let username = localStorage.getItem("registratingUserEmail");
            if (username) {
                let digits = [digit1, digit2, digit3, digit4, digit5, digit6];
                let activationCode = digits.map(String).join("");
                let response = await activateUserAccount(username, activationCode);
                let data = response?.data;
                if (data) {
                    navigate(SIGH_IN_ROUTE);
                    localStorage.removeItem("registratingUserEmail");
                    setInformMessage("Account is activated");
                } else {
                    setInformMessage("Something went wrong! If you have not activated your account but see this message, try to resend the activation code or recreate your account");
                }
            }
        } else {
            setInformMessage("Please provide the code");
        }
    }

    return (
        <div className="account-activation-page">
            <div className="account-activation-page-container">
                <h1 className="account-activation-page-heading">Activation code</h1>
                <div className="account-activation-page-code-container">
                    <input className="account-activation-page-digit" value={digit1} onChange={handleChangeDigit1} type="text" maxLength={1} />
                    <input className="account-activation-page-digit" value={digit2} onChange={handleChangeDigit2} type="text" maxLength={1} />
                    <input className="account-activation-page-digit" value={digit3} onChange={handleChangeDigit3} type="text" maxLength={1} />
                    <input className="account-activation-page-digit" value={digit4} onChange={handleChangeDigit4} type="text" maxLength={1} />
                    <input className="account-activation-page-digit" value={digit5} onChange={handleChangeDigit5} type="text" maxLength={1} />
                    <input className="account-activation-page-digit" value={digit6} onChange={handleChangeDigit6} type="text" maxLength={1} />
                </div>
                <div className="account-activation-page-button-container">
                    <button onClick={onConfirmAccountActivationButtonClick} className="account-activation-page-button">Confirm</button>
                </div>
            </div>
        </div>
    );
}