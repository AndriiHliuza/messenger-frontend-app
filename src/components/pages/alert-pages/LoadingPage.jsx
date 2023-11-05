import { React } from "react";
import "./AlertPage.css";
import FadeLoader from "react-spinners/FadeLoader";

export default function LoadingPage() {

    return (
        <div className="alert-page">
            <FadeLoader
                color={"#363fd6"}
                loading={true}
                radius={10}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}