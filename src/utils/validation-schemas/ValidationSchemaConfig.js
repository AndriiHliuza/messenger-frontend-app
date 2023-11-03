import * as yup from "yup";
import { PASSWORD_REGEX } from "../../config";


export const registrationSchema = yup.object().shape({
    username: yup
        .string()
        .email("Please enter a valid email")
        .required(),
    password: yup
        .string()
        .min(8)
        .matches(PASSWORD_REGEX, {
            message: "Password must include uppercase, lowercase letters, a number and a special character. Allowed special characters: !@#$%.,;"
        })
        .required(),
    confirmedPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required(),
    uniqueName: yup
        .string()
        .required(),
    firstname: yup
        .string()
        .required(),
    lastname: yup
        .string()
        .required(),
    birthday: yup
        .date()
        .max(new Date(), ({ max }) => `Date needs to be before ${new Date()}`)
});


export const authenticationSchema = yup.object().shape({
    username: yup
        .string()
        .email("Please enter a valid email")
        .required(),
    password: yup
        .string()
        .required()
});