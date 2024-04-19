import { React } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { registrationSchema } from "../../../../utils/validation-schemas/ValidationSchemaConfig"
import "../AuthPages.css";
import FormItem from "../FormItem";
import { 
    USER_ROUTE,
    ADMIN_ROUTE,
    ROOT_ROUTE,
    SIGH_IN_ROUTE,
    HOME_ROUTE
} from "../../../../config";
import { register } from "../../../../axios/AuthAPI";
import { getUserByUsernameAndRole } from "../../../../axios/UserAPI";
import { jwtDecode } from "jwt-decode";
import { Role } from "../../../../utils/Role";
import { useAppContext } from "../../../../App";
import { generateKeyPair } from "../../../../utils/E2EEProvider";

export default function RegistrationPage() {

    const navigate = useNavigate();
    const { setUser } = useAppContext();

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
            const username = jwtDecode(data.accessToken).sub;
            const role = jwtDecode(data.accessToken).role;
            if (username && role) {
                const response = await getUserByUsernameAndRole(username, role);
                if (response != null && response?.data?.username === username && response?.data?.uniqueName === values.uniqueName) {
                    const uniqueName = response.data.uniqueName;
                    setUser({
                        username: username,
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
