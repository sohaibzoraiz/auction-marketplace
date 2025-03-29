import React, { useEffect } from "react";

const Modal = ({ title, content, onClose, type, buttonText, buttonAction, autoRedirect }) => {
    
    useEffect(() => {
        if (autoRedirect) {
            setTimeout(() => {
                buttonAction();
            }, 3000); // Redirect after 3 seconds
        }
    }, [autoRedirect, buttonAction]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-box ${type}`} onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <div className="modal-icon">
                    {type === "Success" ? "🎉" :
                    type === "Error" ? "⚠️" :
                    type === "LoginError" ? "🔒" :
                    "💰"}
                </div>
                <h2 className="modal-title">{title}</h2>
                <p className="modal-content">{content}</p>
                <button className="primary-btn btn-hover" onClick={buttonAction}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default Modal;
