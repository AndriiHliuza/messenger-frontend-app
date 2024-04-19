import { React } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { authenticationSchema } from "../../../../utils/validation-schemas/ValidationSchemaConfig";
import "../AuthPages.css";
import FormItem from "../FormItem";
import {
    USER_ROUTE,
    ADMIN_ROUTE,
    ROOT_ROUTE,
    SIGN_UP_ROUTE,
    HOME_ROUTE
} from "../../../../config";
import { authenticate } from "../../../../axios/AuthAPI";
import { getUserByUsernameAndRole } from "../../../../axios/UserAPI";
import { jwtDecode } from "jwt-decode";
import { Role } from "../../../../utils/Role";
import { useAppContext } from "../../../../App";
import { generateKeyPair } from "../../../../utils/E2EEProvider";
import { exchangePublicEncryptionKeys } from "../../../../axios/EncryptionKeysAPI";

export default function LoginPage() {

    const navigate = useNavigate();
    const { setUser } = useAppContext();

    const onSubmit = async (values, actions) => {
        const data = await authenticate(
            values.username,
            values.password
        );
        actions.resetForm();
        if (data?.accessToken && data?.refreshToken) {
            const username = jwtDecode(data.accessToken).sub;
            const role = jwtDecode(data.accessToken).role;
            if (username && role) {
                const response = await getUserByUsernameAndRole(username, role);
                if (response != null && response?.data?.username === username) {
                    const uniqueName = response.data.uniqueName;
                    setUser({
                        username: jwtDecode(data.accessToken).sub,
                        uniqueName: uniqueName,
                        authenticated: true,
                        role: role
                    });
                    generateKeyPair();
                    switch (role) {
                        case Role.USER:
                            navigate(USER_ROUTE + "/" + uniqueName);
                            break;
                        case Role.ADMIN:
                            navigate(ADMIN_ROUTE + "/" + uniqueName);
                            break;
                        case Role.ROOT:
                            navigate(ROOT_ROUTE + "/" + uniqueName);
                            break;
                        default :
                            navigate(HOME_ROUTE);
                    }
                }
            }
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
            {({ isSubmitting }) => (
                <div className="authPage">
                    <div className="authForm">
                        <h1>Sign In</h1>
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
                            <button disabled={isSubmitting} type="submit">Sign In</button>
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
