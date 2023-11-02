import { React } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { authenticationSchema } from "../../../../utils/validation-schemas/ValidationSchemaConfig";
import "../AuthPages.css";
import FormItem from "../FormItem";
import { 
    SIGN_UP_ROUTE,
    PROFILE_ROUTE
} from "../../../../config";
import { authenticate } from "../../../../axios/UserAuthAPI";
import { useAuth } from "../../../../utils/AuthProvider"
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const onSubmit = async (values, actions) => {
        const data = await authenticate(
            values.username,
            values.password
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
                password: ""
            }} 
            validationSchema={authenticationSchema}
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
                            <button disabled={isSubmitting} type="submit">Sign Up</button>
                            <div className="sign-item">
                                <span className="sign-item-text">Don't have an accout yet?</span>
                                <Link to={SIGN_UP_ROUTE}>Sign Up</Link>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </Formik>
    );
}
