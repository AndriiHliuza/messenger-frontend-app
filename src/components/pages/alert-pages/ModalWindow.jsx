import { React, useEffect, useRef } from "react";
import "./AlertPage.css";

export default function ModalWindow(props) {

    const { setOpened, isOpened, message, onClose, onConfirm } = props;
    const dialogRef = useRef(null);

    useEffect(() => {
        if (isOpened) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current.close();
        }
    }, [isOpened]);

    return (
        <dialog className="modal-window" ref={dialogRef}>
            <p className="modal-window-message">{message}</p>
            <div className="modal-window-buttons">
                <button className="modal-window-button" onClick={onConfirm}>Confirm</button>
                <button className="modal-window-button" onClick={onClose}>Cancel</button>
            </div>
        </dialog>
    );
}