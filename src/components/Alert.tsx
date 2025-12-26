// Alert.tsx
import '../styles/alert.css';
import React, { useState, useEffect } from 'react';
import '../styles/alert.css';

export type AlertType = 'success' | 'error';

export interface AlertProps {
    type: AlertType;
    message: string;
    onClose?: () => void;
    autoClose?: boolean;
    duration?: number;
    position?: 'top' | 'bottom' | 'top-right' | 'top-left';
}

const Alert: React.FC<AlertProps> = ({
    type,
    message,
    onClose,
    autoClose = false,
    duration = 5000,
    position = 'top'
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            setIsExiting(false);
        }
    }, [message]);

    useEffect(() => {
        if (autoClose && isVisible && message && !isExiting) {
            const timer = setTimeout(() => {
                startExitAnimation();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, isVisible, message, isExiting]);

    const startExitAnimation = () => {
        setIsExiting(true);

        setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 300); // مدت زمان انیمیشن خروج
    };

    const handleClose = () => {
        startExitAnimation();
    };

    const getAlertConfig = () => {
        const configs = {
            success: {
                title: 'موفقیت',
                icon: '✓',
                bgColor: '#d4edda',
                borderColor: '#c3e6cb',
                textColor: '#155724',
                iconColor: '#28a745'
            },
            error: {
                title: 'خطا',
                icon: '✗',
                bgColor: '#f8d7da',
                borderColor: '#f5c6cb',
                textColor: '#721c24',
                iconColor: '#dc3545'
            }
        };
        return configs[type];
    };

    if (!isVisible || !message) {
        return null;
    }

    const config = getAlertConfig();

    const positionClasses = {
        'top': 'alert-fixed-top',
        'bottom': 'alert-fixed-bottom',
        'top-right': 'alert-fixed-top-right',
        'top-left': 'alert-fixed-top-left'
    };

    return (
        <div
            className={`alert alert-fixed alert-${type} ${positionClasses[position]} ${isExiting ? 'alert-exiting' : 'alert-entering'
                }`}
            style={{
                backgroundColor: config.bgColor,
                borderColor: config.borderColor,
                color: config.textColor
            }}
            role="alert"
            aria-live="assertive"
        >
            <div className="alert-content">
                <div className="alert-icon" style={{ color: config.iconColor }}>
                    {config.icon}
                </div>
                <div className="alert-message">
                    <strong>{config.title}</strong>
                    <p>{message}</p>
                </div>
            </div>
            <button
                className="alert-close"
                onClick={handleClose}
                aria-label="بستن پیام"
                title="بستن"
            >
                &times;
            </button>

            {autoClose && (
                <div className="alert-progress">
                    <div
                        className="alert-progress-bar"
                        style={{
                            backgroundColor: config.iconColor,
                            animationDuration: `${duration}ms`
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Alert;