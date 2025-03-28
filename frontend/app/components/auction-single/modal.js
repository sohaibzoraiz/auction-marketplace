import React from "react";

const Modal = ({ title, content, onClose, type }) => {
    return (
        <div className="modal-overlay">
            <div className={`modal-box ${type}`}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <div className="modal-icon">
                    {type === "success" ? (
                        <span className="icon-success">🎉</span>
                    ) : (
                        <span className="icon-error">⚠️</span>
                    )}
                </div>
                <h2 className="modal-title">{title}</h2>
                <p className="modal-content">{content}</p>
                <button className="modal-button" onClick={onClose}>
                    {type === "success" ? "Know More" : "Retry"}
                </button>
            </div>
        </div>
    );
};

export default Modal;
