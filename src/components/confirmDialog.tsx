// ConfirmDialog.tsx
import React, { useEffect } from 'react';
import '../styles/confirmDialog.css';


export interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'تأیید',
    cancelText = 'انصراف',
    type = 'warning'
}) => {
    // هوک‌ها باید قبل از هر شرطی باشند
    useEffect(() => {
        if (!isOpen) return; // شرط داخل useEffect باشد

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            } else if (e.key === 'Enter') {
                onConfirm();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onCancel, onConfirm]); // وابستگی‌ها را اضافه کنید

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    const getTypeColor = () => {
        switch (type) {
            case 'danger': return '#dc3545';
            case 'warning': return '#ffc107';
            case 'info': return '#17a2b8';
            default: return '#ffc107';
        }
    };

    // شرط return باید بعد از تمام هوک‌ها باشد
    if (!isOpen) return null;

    return (
        <div
            className="confirm-dialog-overlay"
            onClick={handleOverlayClick}
            dir="rtl"
        >
            <div
                className="confirm-dialog"
                role="dialog"
                aria-labelledby="confirm-dialog-title"
                aria-modal="true"
            >
                <div
                    className="confirm-dialog-header"
                    style={{ borderBottomColor: getTypeColor() }}
                >
                    <div className="confirm-dialog-icon">
                        {type === 'danger' && '⚠️'}
                        {type === 'warning' && '⚠️'}
                        {type === 'info' && 'ℹ️'}
                    </div>
                    <h3
                        id="confirm-dialog-title"
                        className="confirm-dialog-title"
                    >
                        {title}
                    </h3>
                    <button
                        className="confirm-dialog-close"
                        onClick={onCancel}
                        aria-label="بستن"
                    >
                        &times;
                    </button>
                </div>

                <div className="confirm-dialog-body">
                    <p className="confirm-dialog-message">{message}</p>
                </div>

                <div className="confirm-dialog-footer">
                    <button
                        className="confirm-dialog-button confirm-dialog-button-cancel"
                        onClick={onCancel}
                        autoFocus
                    >
                        {cancelText}
                    </button>
                    <button
                        className="confirm-dialog-button confirm-dialog-button-confirm"
                        onClick={onConfirm}
                        style={{ backgroundColor: getTypeColor() }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;