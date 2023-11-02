import { React } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { registrationSchema } from "../../../../utils/validation-schemas/ValidationSchemaConfig"
import "../AuthPages.css";
import FormItem from "../FormItem";
import { 
    SIGH_IN_ROUTE,
    PROFILE_ROUTE
} from "../../../../config";
import { register } from "../../../../axios/UserAuthAPI";
import { useAuth } from "../../../../utils/AuthProvider"
import { jwtDecode } from "jwt-decode";

export default function RegistrationPage() {

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const onSubmit = async (values, actions) => {
        const data = await register(
            values.username,
            values.password,
            values.firstname,
            values.lastname,
            values.birthday
        );
        actions.resetForm();
        if (data?.accessToken && data?.refreshToken) {
            setUser({
                username: jwtDecode(data.accessToken).sub,
                authenticated: true,
                role: jwtDecode(data.accessToken).role 
            });
            navigate(PROFILE_ROUTE);
        }
    }

    return (
        <Formik 
            initialValues={{
                username: "",
                password: "",
                confirmedPassword: "",
                firstname: "",
                lastname: "",
                birthday: ""
            }} 
            validationSchema={registrationSchema}
            onSubmit={onSubmit}
        >
            {({isSubmitting}) => (
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
