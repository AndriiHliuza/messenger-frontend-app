import { React } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { registrationSchema } from "../../../../utils/validation-schemas/ValidationSchemaConfig"
import "../AuthPages.css";
import FormItem from "../FormItem";
import { 
    ADMIN_PROFILE_ROUTE,
    ROOT_PROFILE_ROUTE,
    USER_PROFILE_ROUTE,
    SIGH_IN_ROUTE,
    HOME_ROUTE
} from "../../../../config";
import { register } from "../../../../axios/AuthAPI";
import { useAuth } from "../../../../utils/AuthProvider"
import { jwtDecode } from "jwt-decode";

export default function RegistrationPage() {

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const onSubmit = async (values, actions) => {
        const data = await register(
            values.username,
            values.password,
            values.uniqueName,
            values.firstname,
            values.lastname,
            values.birthday
        );
        actions.resetForm();
        if (data?.accessToken && data?.refreshToken) {
            const uniqueName = jwtDecode(data.accessToken).uniqueName;
            const role = jwtDecode(data.accessToken).role;
            setUser({
                username: jwtDecode(data.accessToken).sub,
                uniqueName: uniqueName,
                authenticated: true,
                role: role 
            });
            switch (role) {
                case "USER":
                    navigate(USER_PROFILE_ROUTE + "/" + uniqueName);
                    break;
                case "ADMIN":
                    navigate(ADMIN_PROFILE_ROUTE + "/" + uniqueName);
                    break;
                case "ROOT":
                    navigate(ROOT_PROFILE_ROUTE + "/" + uniqueName);
                    break;
                default :
                    navigate(HOME_ROUTE);
            }
        }
    }

    return (
        <Formik 
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
                                label="Unique name (It helps other people in WebTalk to find you):"
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
