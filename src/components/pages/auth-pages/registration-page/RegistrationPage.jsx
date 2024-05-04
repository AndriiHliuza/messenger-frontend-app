import { React, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import { registrationSchema } from "../../../../utils/validation-schemas/ValidationSchemaConfig"
import "../AuthPages.css";
import FormItem from "../FormItem";
import { SIGH_IN_ROUTE } from "../../../../config";
import { register } from "../../../../axios/AuthAPI";
import { useAppContext } from "../../../../App";
import AfterUserRegistrationPage from "../../alert-pages/AfterUserRegistrationPage";

export default function RegistrationPage() {

    const { setInformMessage } = useAppContext();
    const [isRegistrationSuccessful, setRegistrationSuccessful] = useState(false);

    const onSubmit = async (values, actions) => {
        if (!values.username) {
            setInformMessage("Provide email");
            return;
        } else if (!values.password) {
            setInformMessage("Provide password");
            return;
        } else if (!values.confirmedPassword) {
            setInformMessage("Confirm password");
            return;
        } else if (!values.uniqueName) {
            setInformMessage("Provide username");
            return;
        } else if (!values.firstname) {
            setInformMessage("Provide firstname");
            return;
        } else if (!values.lastname) {
            setInformMessage("Provide lastname");
            return;
        }

        const data = await register(
            values.username,
            values.password,
            values.uniqueName,
            values.firstname,
            values.lastname,
            values.birthday
        );
        actions.resetForm();
        if (data) {
            let user = data?.user;
            let isRegistrationSuccessful = data?.registrationSuccessful;
            if (user && isRegistrationSuccessful) {
                setRegistrationSuccessful(true);
                if (user?.username) {
                    localStorage.setItem("registratingUserEmail", user.username);
                }
            }
        } else {
            setInformMessage("Can not create an accout. Maybe such user already exists");
        }
    }

    return (
        isRegistrationSuccessful
            ? <AfterUserRegistrationPage />
            : <Formik
                initialValues={{
                    username: "",
                    password: "",
                    confirmedPassword: "",
                    uniqueName: "",
                    firstname: "",
                    lastname: "",
                    birthday: ""
                }}
                validationSchema={registrationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <div className="authPage">
                        <div className="authForm">
                            <h1>Sign Up</h1>
                            <Form>
                                <FormItem
                                    label="Email:"
                                    id="username"
                                    name="username"
                                    type="email"
                                    placeholder="johnsmith@gmail.com"
                                />
                                <FormItem
                                    label="Password:"
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="3245!mySuperSecurePassword$8976"
                                />
                                <FormItem
                                    label="Confirm password:"
                                    id="confirmedPassword"
                                    name="confirmedPassword"
                                    type="password"
                                    placeholder="3245!mySuperSecurePassword$8976"
                                />
                                <FormItem
                                    label="Username:"
                                    id="uniqueName"
                                    name="uniqueName"
                                    type="text"
                                    placeholder="JohnSmith"
                                />
                                <FormItem
                                    label="First name:"
                                    id="firstname"
                                    name="firstname"
                                    type="text"
                                    placeholder="John"
                                />
                                <FormItem
                                    label="Last name:"
                                    id="lastname"
                                    name="lastname"
                                    type="text"
                                    placeholder="Smith"
                                />
                                <FormItem
                                    label="Birthday:"
                                    id="birthday"
                                    name="birthday"
                                    type="date"
                                    placeholder=""
                                />
                                <button disabled={isSubmitting} type="submit">Sign Up</button>
                                <div className="sign-item">
                                    <span className="sign-item-text">Already have an account?</span>
                                    <Link to={SIGH_IN_ROUTE}>Sign In</Link>
                                </div>
                            </Form>
                        </div>
                    </div>
                )}
            </Formik>
    );
}
