import React from "react";

const Modal = ({ title, content, onClose, type }) => {
    return (
        <div className="modal-overlay">
            <div className={`modal-box ${type}`}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <div className="modal-icon">
                    {type === "Success" ? (
                        <span className="icon-success">🎉</span>
                    ) : (
                        <span className="icon-error">⚠️</span>
                    )}
                </div>
                <h2 className="modal-title">{title}</h2>
                <p className="modal-content">{content}</p>
                <button className="modal-button" onClick={onClose}>
                    {type === "Success" ? "Continue Bidding" : "Retry"}
                </button>
            </div>
        </div>
    );
};

export default Modal;
