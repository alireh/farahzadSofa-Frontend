// MessageModal.tsx را با این کد جایگزین کنید:
import React, { useState, useEffect } from 'react';

interface Message {
    id: number;
    name: string;
    email: string;
    message: string;
    created_at: string;
    is_read: number;
}

interface MessageModalProps {
    message: Message;
    onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // انیمیشن ورود
        setTimeout(() => {
            setIsVisible(true);
        }, 10);

        // جلوگیری از اسکرول بدنه
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    // قالب‌بندی تاریخ
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    // کپی ایمیل به کلیپ‌بورد
    const copyEmail = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(message.email);
            alert('ایمیل کپی شد');
        } catch (error) {
            console.error('خطا در کپی ایمیل:', error);
        }
    };

    return (
        <div
            style={{
                ...styles.overlay,
                opacity: isVisible ? 1 : 0,
            }}
            onClick={handleClose}
        >
            <div
                style={{
                    ...styles.modal,
                    transform: isVisible ? 'translateY(0)' : 'translateY(-50px)',
                    opacity: isVisible ? 1 : 0,
                }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                {/* هدر مودال */}
                <div style={styles.header}>
                    <div style={styles.headerContent}>
                        <h3 style={styles.title}>مشاهده پیام</h3>
                        <div style={styles.messageInfo}>
                            <span style={styles.idBadge}>#{message.id}</span>
                            <span
                                style={{
                                    ...styles.statusBadge,
                                    ...(message.is_read === 0
                                        ? styles.unreadBadge
                                        : styles.readBadge)
                                }}
                            >
                                {message.is_read === 0 ? 'خوانده نشده' : 'خوانده شده'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        style={styles.closeButton}
                        aria-label="بستن"
                    >
                        ✕
                    </button>
                </div>

                {/* اطلاعات فرستنده */}
                <div style={styles.senderInfo}>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>فرستنده:</span>
                        <span style={styles.infoValue}>{message.name}</span>
                    </div>

                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>ایمیل:</span>
                        <div style={styles.emailContainer}>
                            <a
                                href={`mailto:${message.email}`}
                                style={styles.emailLink}
                            >
                                {message.email}
                            </a>
                            <button
                                onClick={copyEmail}
                                style={styles.copyButton}
                                title="کپی ایمیل"
                            >
                                📋
                            </button>
                        </div>
                    </div>

                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>تاریخ ارسال:</span>
                        <span style={styles.infoValue}>{formatDate(message.created_at)}</span>
                    </div>
                </div>

                {/* متن پیام */}
                <div style={styles.messageContainer}>
                    <div style={styles.messageHeader}>
                        <span style={styles.messageTitle}>متن پیام:</span>
                    </div>
                    <div style={styles.messageContent}>
                        <div style={styles.messageText}>
                            {message.message.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* فوتر مودال */}
                <div style={styles.footer}>
                    <div style={styles.footerActions}>
                        <a
                            href={`mailto:${message.email}?subject=پاسخ به پیام شما&body=سلام ${message.name}،%0D%0A%0D%0A`}
                            style={styles.replyButton}
                        >
                            ✉️ پاسخ به پیام
                        </a>
                        <button
                            onClick={() => window.open(`https://mail.google.com/mail/?view=cm&to=${message.email}`, '_blank')}
                            style={styles.gmailButton}
                        >
                            📧 پاسخ در جیمیل
                        </button>
                    </div>
                    <div style={styles.messageMeta}>
                        <span style={styles.metaText}>
                            طول پیام: {message.message.length} کاراکتر
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(5px)',
        transition: 'opacity 0.3s ease',
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        backgroundColor: '#2c3e50',
        color: 'white',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    headerContent: {
        flex: 1,
    },
    title: {
        margin: 0,
        fontSize: '20px',
        fontWeight: 600,
        marginBottom: '8px',
    },
    messageInfo: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    },
    idBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontFamily: 'monospace',
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 500,
    },
    unreadBadge: {
        backgroundColor: '#e74c3c',
    },
    readBadge: {
        backgroundColor: '#27ae60',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer',
        padding: 0,
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        transition: 'background-color 0.2s',
    },
    senderInfo: {
        padding: '24px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e9ecef',
    },
    infoItem: {
        display: 'flex',
        marginBottom: '12px',
        alignItems: 'center',
    },
    infoLabel: {
        width: '100px',
        color: '#495057',
        fontWeight: 500,
        fontSize: '14px',
        flexShrink: 0,
    },
    infoValue: {
        color: '#2c3e50',
        fontSize: '15px',
        flex: 1,
    },
    emailContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flex: 1,
    },
    emailLink: {
        color: '#3498db',
        textDecoration: 'none',
        fontSize: '15px',
        flex: 1,
    },
    copyButton: {
        background: 'none',
        border: '1px solid #ddd',
        borderRadius: '6px',
        padding: '4px 8px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    messageContainer: {
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    messageHeader: {
        padding: '16px 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e9ecef',
    },
    messageTitle: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#2c3e50',
    },
    messageContent: {
        flex: 1,
        overflow: 'auto',
        padding: '24px',
    },
    messageText: {
        lineHeight: 1.8,
        color: '#34495e',
        fontSize: '15px',
        whiteSpace: 'pre-line',
        fontFamily: 'Vazirmatn, Tahoma, sans-serif',
    },
    footer: {
        padding: '20px 24px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerActions: {
        display: 'flex',
        gap: '10px',
    },
    replyButton: {
        backgroundColor: '#3498db',
        color: 'white',
        textDecoration: 'none',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    gmailButton: {
        backgroundColor: '#ea4335',
        color: 'white',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    messageMeta: {
        color: '#6c757d',
        fontSize: '13px',
    },
    metaText: {
        opacity: 0.8,
    },
};

export default MessageModal;