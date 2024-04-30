import * as yup from "yup";
import { PASSWORD_REGEX } from "../../config";


export const registrationSchema = yup.object().shape({
    username: yup
        .string()
        .email("Please enter a valid email"),
    password: yup
        .string()
        .min(8)
        .matches(PASSWORD_REGEX, {
            message: "Password must include uppercase, lowercase letters, a number and a special character. Allowed special characters: !@#$%.,;"
        }),
    confirmedPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    uniqueName: yup
        .string(),
    firstname: yup
        .string(),
    lastname: yup
        .string(),
    birthday: yup
        .date()
        .max(new Date(), ({ max }) => `Date needs to be before ${new Date()}`)
});


export const authenticationSchema = yup.object().shape({
    username: yup
        .string()
        .email("Please enter a valid email"),
    password: yup
        .string()
});

export const modificationSchema = yup.object().shape({
    uniqueName: yup
        .string(),
    password: yup
        .string()
        .min(8)
        .matches(PASSWORD_REGEX, {
            message: "Password must include uppercase, lowercase letters, a number and a special character. Allowed special characters: !@#$%.,;"
        }),
    firstname: yup
        .string(),
    lastname: yup
        .string(),
    currentPassword: yup
        .string()
        .min(8)
        .matches(PASSWORD_REGEX, {
            message: "Password must include uppercase, lowercase letters, a number and a special character. Allowed special characters: !@#$%.,;"
        })
});

export const adminModificationSchema = yup.object().shape({
    uniqueName: yup
        .string(),
    password: yup
        .string()
        .min(8),
    firstname: yup
        .string(),
    lastname: yup
        .string(),
    currentPassword: yup
        .string()
        .min(8)
});

export const chatCreationSchema = yup.object().shape({
    chatName: yup
        .string()
        .min(4)
});
