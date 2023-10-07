import React from "react";

export default function LoginPage() {
    return (
        <div>
            <form>
                <div>
                    <label htmlFor="loginName">Login</label>
                    <input type="login" id="loginName" />
                </div>
                <div>
                    <label htmlFor="loginPassword">Password</label>
                    <input type="password" id="loginPassword" />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}