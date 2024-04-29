import { useField } from "formik";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./FormItem.css"

export default function FormItem({ label, ...props }) {

    const [field, meta] = useField(props);

    return (
        <div className="formItem">
            <label htmlFor={props.id}>{label}</label>
            <input
                {...props}
                {...field}
                value={field.value ? field.value : ""}
                className={meta?.error && field?.value ? "not-valid-input" : ""}
            />
            <div className={meta?.error && field?.value ? "display-item-error-validation-message" : "hide-item-error-validation-message"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="item-error-message">{meta.error}</span>
            </div>
        </div>
    );
}