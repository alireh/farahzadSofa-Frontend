import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import MessageModal from '../components/MessageModal';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmDialog from "../components/confirmDialog";
const HOST_URL = !!process.env.REACT_APP_HOST_URL ? process.env.REACT_APP_HOST_URL : '';

export type AlertType = 'success' | 'error';

interface AlertState {
    show: boolean;
    type: AlertType;
    message: string;
}

interface Message {
    id: number;
    name: string;
    email: string;
    message: string;
    created_at: string;
    is_read: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface Filters {
    page: number;
    limit: number;
    search: string;
    read: string;
    sort: string;
}

interface Stats {
    total: number;
    unread: number;
    today: number;
    yesterday?: number;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

const AdminMessages: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
    const [filters, setFilters] = useState<Filters>({
        page: 1,
        limit: 20,
        search: '',
        read: '',
        sort: 'newest'
    });
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1
    });
    const [stats, setStats] = useState<Stats>({
        total: 0,
        unread: 0,
        today: 0
    });

    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    // دریافت توکن از localStorage
    const token = localStorage.getItem('token');

    // استفاده از هوک confirm
    const {
        confirmState,
        showConfirm,
        onConfirm,
        onCancel
    } = useConfirm();

    // دریافت پیام‌ها و آمار
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== '' && value !== null && value !== undefined) {
                        params.append(key, value.toString());
                    }
                });

                // دریافت پیام‌ها
                const response = await axios.get<ApiResponse<{
                    messages: Message[];
                    pagination: Pagination;
                    stats: Stats;
                }>>(`${HOST_URL}/api/admin/contact-messages?${params.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Cache-Control': 'no-cache'
                    }
                });

                if (response.data.success) {
                    setMessages(response.data.data.messages);
                    setPagination(response.data.data.pagination);
                    setStats(response.data.data.stats || {
                        total: 0,
                        unread: 0,
                        today: 0
                    });
                }
            } catch (error) {
                if (checkSessionTimeout(error)) {
                    return;
                }
                console.error('خطا در دریافت پیام‌ها:', error);
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 401) {
                    window.location.href = '/admin/login';
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters, token]);

    // تابع مشاهده پیام
    const viewMessage = (message: Message): void => {
        setSelectedMessage(message);
        setShowModal(true);

        // اگر پیام خوانده نشده است، آن را علامت‌گذاری کن
        if (message.is_read === 0) {
            // به‌روزرسانی محلی
            setMessages(prev => prev.map(msg =>
                msg.id === message.id ? { ...msg, is_read: 1 } : msg
            ));

            // به‌روزرسانی آمار محلی
            setStats(prev => ({
                ...prev,
                unread: Math.max(0, prev.unread - 1)
            }));

            // به‌روزرسانی در API
            markAsReadInBackground(message.id);
        }
    };
    const [alert, setAlert] = useState<AlertState>({
        show: false,
        type: 'success',
        message: ''
    });

    const showAlert = (type: AlertType, message: string) => {
        setAlert({
            show: true,
            type,
            message
        });
        setTimeout(() => {
            setAlert(prev => ({ ...prev, show: false }));
        }, 5000);
    };

    // علامت‌گذاری به عنوان خوانده شده در پس‌زمینه
    const markAsReadInBackground = async (id: number): Promise<void> => {
        try {
            await axios.put(`${HOST_URL}/api/admin/contact-messages/${id}`,
                { is_read: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            if (checkSessionTimeout(error)) {
                return;
            }
            console.error('خطا در به‌روزرسانی وضعیت:', error);
        }
    };

    // تغییر وضعیت خوانده/نخوانده
    const toggleReadStatus = async (id: number, isRead: number): Promise<void> => {
        try {
            const newStatus = isRead === 0 ? 1 : 0;

            // به‌روزرسانی محلی
            setMessages(prev => prev.map(msg =>
                msg.id === id ? { ...msg, is_read: newStatus } : msg
            ));

            // به‌روزرسانی آمار محلی
            setStats(prev => ({
                ...prev,
                unread: newStatus === 1
                    ? Math.max(0, prev.unread - 1)
                    : prev.unread + 1
            }));

            // به‌روزرسانی API
            await axios.put(`${HOST_URL}/api/admin/contact-messages/${id}`,
                { is_read: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

        } catch (error) {
            if (checkSessionTimeout(error)) {
                return;
            }
            console.error('خطا در تغییر وضعیت:', error);
        }
    };

    // حذف پیام
    const deleteMessage = async (id: number): Promise<void> => {
        const messageToDelete = messages.find(msg => msg.id === id);
        if (!messageToDelete) return;

        try {
            // ابتدا API را صدا بزن
            await axios.delete(`${HOST_URL}/api/admin/contact-messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // سپس به‌روزرسانی محلی
            setMessages(prev => prev.filter(msg => msg.id !== id));

            // به‌روزرسانی آمار محلی
            setStats(prev => ({
                ...prev,
                total: Math.max(0, prev.total - 1),
                unread: messageToDelete.is_read === 0
                    ? Math.max(0, prev.unread - 1)
                    : prev.unread
            }));

            // حذف از انتخاب‌ها
            setSelectedMessages(prev => prev.filter(msgId => msgId !== id));

        } catch (error) {
            if (checkSessionTimeout(error)) {
                return;
            }
            console.error('خطا در حذف پیام:', error);
            showAlert('error', 'خطا در حذف پیام. لطفاً دوباره تلاش کنید.');
        }
    };

    const checkSessionTimeout = (error: any) => {
        if (error.status == 401) {
            showAlert('error', 'زمان نشست شما منقضی شده است دوباره وارد شوید');
            setTimeout(() => {
                window.location.href = '/login'
            }, 3000);
            return true;
        }
        return false;
    }

    // حذف چندتایی
    const deleteSelected = async (): Promise<void> => {
        if (selectedMessages.length === 0) return;

        try {
            // ابتدا API را صدا بزن
            await axios.delete(`${HOST_URL}/api/admin/contact-messages`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { ids: selectedMessages }
            });

            // پیام‌های حذف شده
            const deletedMessages = messages.filter(msg => selectedMessages.includes(msg.id));
            const deletedUnreadCount = deletedMessages.filter(msg => msg.is_read === 0).length;

            // به‌روزرسانی محلی
            setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg.id)));

            // به‌روزرسانی آمار محلی
            setStats(prev => ({
                ...prev,
                total: Math.max(0, prev.total - deletedMessages.length),
                unread: Math.max(0, prev.unread - deletedUnreadCount)
            }));

            // پاک کردن انتخاب‌ها
            setSelectedMessages([]);

        } catch (error) {
            if (checkSessionTimeout(error)) {
                return;
            }
            console.error('خطا در حذف پیام‌ها:', error);
            showAlert('error', 'خطا در حذف پیام‌ها. لطفاً دوباره تلاش کنید.');
        }
    };

    // بستن مودال
    const closeModal = (): void => {
        setShowModal(false);
        setTimeout(() => {
            setSelectedMessage(null);
        }, 300);
    };

    // انتخاب/عدم انتخاب همه
    const toggleSelectAll = (): void => {
        if (selectedMessages.length === messages.length) {
            setSelectedMessages([]);
        } else {
            setSelectedMessages(messages.map(msg => msg.id));
        }
    };

    // تغییر فیلترها
    const handleFilterChange = (key: keyof Filters, value: string | number): void => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // برگشت به صفحه اول هنگام تغییر فیلتر
        }));
    };

    // قالب‌بندی تاریخ
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // تولید اعداد صفحه برای صفحه‌بندی
    const generatePageNumbers = (): number[] => {
        const totalPages = pagination.totalPages;
        const currentPage = filters.page;

        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 3) {
            return [1, 2, 3, 4, 5];
        }

        if (currentPage >= totalPages - 2) {
            return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    };

    // handler برای حذف با confirmation
    const handleDeleteMessage = async (id: number): Promise<void> => {
        const message = messages.find(msg => msg.id === id);
        if (!message) return;

        // const isConfirmed = window.confirm(`آیا از حذف پیام "${message.name}" اطمینان دارید؟`);
        // if (isConfirmed) {
        //     await deleteMessage(id);
        // }


        const isConfirmed = await showConfirm({
            title: 'حذف پیام‌ها',
            message: `آیا از حذف پیام "${message.name}" اطمینان دارید؟`,
            confirmText: 'بله، حذف شود',
            cancelText: 'انصراف',
            type: 'danger'
        });

        if (isConfirmed) {
            await deleteMessage(id);
        }
    };

    // handler برای حذف گروهی با confirmation
    const handleDeleteSelected = async (): Promise<void> => {
        if (selectedMessages.length === 0) {
            showAlert('error', 'هیچ پیامی انتخاب نشده است.');
            return;
        }



        const isConfirmed = await showConfirm({
            title: 'حذف پیام‌ها',
            message: `آیا از حذف ${selectedMessages.length} پیام انتخاب شده اطمینان دارید؟`,
            confirmText: 'بله، حذف شود',
            cancelText: 'انصراف',
            type: 'danger'
        });

        if (isConfirmed) {
            await deleteSelected();
        }
    };

    // استایل‌ها
    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            padding: '20px',
            backgroundColor: '#f5f7fa',
            minHeight: '100vh',
            fontFamily: 'Vazirmatn, Tahoma, sans-serif',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            flexWrap: 'wrap' as const,
            gap: '20px',
        },
        title: {
            color: '#2c3e50',
            margin: 0,
            fontSize: '24px',
            fontWeight: 600,
        },
        stats: {
            display: 'flex',
            gap: '30px',
            flexWrap: 'wrap' as const,
        },
        statItem: {
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            minWidth: '100px',
        },
        statLabel: {
            fontSize: '12px',
            color: '#7f8c8d',
            marginBottom: '5px',
        },
        statValue: {
            fontSize: '24px',
            fontWeight: 'bold' as const,
            color: '#2c3e50',
        },
        filters: {
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            flexWrap: 'wrap' as const,
        },
        searchInput: {
            flex: 1,
            minWidth: '200px',
            padding: '10px 15px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            fontFamily: 'inherit',
        },
        select: {
            padding: '10px 15px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none',
            fontFamily: 'inherit',
            minWidth: '150px',
        },
        bulkActions: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px',
            backgroundColor: '#fff3cd',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ffeaa7',
        },
        bulkDeleteButton: {
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'inherit',
            transition: 'background-color 0.2s',
        },
        tableContainer: {
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            overflowX: 'auto' as const,
        },
        loading: {
            padding: '60px',
            textAlign: 'center' as const,
            color: '#7f8c8d',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: '15px',
        },
        spinner: {
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
        },
        emptyMessage: {
            padding: '40px',
            textAlign: 'center' as const,
            color: '#bdc3c7',
            fontSize: '18px',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse' as const,
            minWidth: '800px',
        },
        th: {
            padding: '15px',
            textAlign: 'right' as const,
            backgroundColor: '#f8f9fa',
            borderBottom: '2px solid #e9ecef',
            color: '#495057',
            fontWeight: 600,
            fontSize: '14px',
        },
        tr: {
            borderBottom: '1px solid #e9ecef',
            transition: 'background-color 0.2s',
        },
        unreadRow: {
            backgroundColor: '#f8f9ff',
            fontWeight: 500,
        },
        td: {
            padding: '15px',
            textAlign: 'right' as const,
            color: '#495057',
            fontSize: '14px',
        },
        checkbox: {
            cursor: 'pointer',
        },
        nameCell: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        newBadge: {
            backgroundColor: '#e74c3c',
            color: 'white',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '10px',
            fontWeight: 'bold' as const,
        },
        emailCell: {
            direction: 'ltr' as const,
            textAlign: 'right' as const,
        },
        emailLink: {
            color: '#3498db',
            textDecoration: 'none',
            transition: 'color 0.2s',
        },
        messagePreview: {
            maxWidth: '300px',
            whiteSpace: 'nowrap' as const,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: '#666',
        },
        dateCell: {
            fontSize: '13px',
            color: '#7f8c8d',
            whiteSpace: 'nowrap' as const,
        },
        statusButton: {
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
        },
        unreadButton: {
            backgroundColor: '#ffeaa7',
            color: '#e17055',
        },
        readButton: {
            backgroundColor: '#55efc4',
            color: '#00b894',
        },
        actionButtons: {
            display: 'flex',
            gap: '5px',
        },
        viewButton: {
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'background-color 0.2s',
            fontFamily: 'inherit',
            fontWeight: 500,
        },
        deleteButton: {
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'background-color 0.2s',
            fontFamily: 'inherit',
            fontWeight: 500,
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            marginTop: '30px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            flexWrap: 'wrap' as const,
        },
        pageButton: {
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'background-color 0.2s',
            fontFamily: 'inherit',
        },
        disabledButton: {
            backgroundColor: '#bdc3c7',
            cursor: 'not-allowed',
            opacity: 0.6,
        },
        pageNumbers: {
            display: 'flex',
            gap: '5px',
            flexWrap: 'wrap' as const,
            justifyContent: 'center',
        },
        pageNumber: {
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #ddd',
            backgroundColor: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
        },
        activePage: {
            backgroundColor: '#3498db',
            color: 'white',
            borderColor: '#3498db',
        },
    };

    // استایل انیمیشن
    const spinAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

    return (
        <>
            {/* دیالوگ تأیید */}
            <ConfirmDialog
                isOpen={confirmState.isOpen}
                title={confirmState.title!}
                message={confirmState.message}
                onConfirm={onConfirm}
                onCancel={onCancel}
                confirmText={confirmState.confirmText}
                cancelText={confirmState.cancelText}
                type={confirmState.type}
            />
            <style>{spinAnimation}</style>
            <div style={styles.container}>
                {/* هدر با آمار */}
                <div style={styles.header}>
                    <h2 style={styles.title}>مدیریت پیام‌های تماس</h2>
                    <div style={styles.stats}>
                        <div style={styles.statItem}>
                            <span style={styles.statLabel}>کل پیام‌ها:</span>
                            <span style={styles.statValue}>{stats.total || 0}</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statLabel}>خوانده نشده:</span>
                            <span style={{ ...styles.statValue, color: '#e74c3c' }}>
                                {stats.unread || 0}
                            </span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statLabel}>امروز:</span>
                            <span style={{ ...styles.statValue, color: '#27ae60' }}>
                                {stats.today || 0}
                            </span>
                        </div>
                    </div>
                </div>

                {/* فیلترها */}
                <div style={styles.filters}>
                    <input
                        type="text"
                        placeholder="جستجو در نام، ایمیل یا متن پیام..."
                        value={filters.search}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleFilterChange('search', e.target.value)
                        }
                        style={styles.searchInput}
                    />

                    <select
                        value={filters.read}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleFilterChange('read', e.target.value)
                        }
                        style={styles.select}
                    >
                        <option value="">همه وضعیت‌ها</option>
                        <option value="read">خوانده شده</option>
                        <option value="unread">خوانده نشده</option>
                    </select>

                    <select
                        value={filters.sort}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleFilterChange('sort', e.target.value)
                        }
                        style={styles.select}
                    >
                        <option value="newest">جدیدترین</option>
                        <option value="oldest">قدیمی‌ترین</option>
                        <option value="name">بر اساس نام</option>
                        <option value="email">بر اساس ایمیل</option>
                    </select>

                    <select
                        value={filters.limit}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleFilterChange('limit', e.target.value)
                        }
                        style={styles.select}
                    >
                        <option value="10">10 مورد در صفحه</option>
                        <option value="20">20 مورد در صفحه</option>
                        <option value="50">50 مورد در صفحه</option>
                        <option value="100">100 مورد در صفحه</option>
                    </select>
                </div>

                {/* عملیات گروهی */}
                {selectedMessages.length > 0 && (
                    <div style={styles.bulkActions}>
                        <span>{selectedMessages.length} پیام انتخاب شده</span>
                        <button
                            onClick={handleDeleteSelected}
                            style={styles.bulkDeleteButton}
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.currentTarget.style.backgroundColor = '#c0392b';
                            }}
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.currentTarget.style.backgroundColor = '#e74c3c';
                            }}
                        >
                            حذف انتخاب شده‌ها
                        </button>
                    </div>
                )}

                {/* جدول پیام‌ها */}
                <div style={styles.tableContainer}>
                    {loading ? (
                        <div style={styles.loading}>
                            <div style={styles.spinner}></div>
                            در حال بارگذاری پیام‌ها...
                        </div>
                    ) : messages.length === 0 ? (
                        <div style={styles.emptyMessage}>
                            📭 هیچ پیامی یافت نشد
                        </div>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>
                                        <input
                                            type="checkbox"
                                            checked={selectedMessages.length === messages.length && messages.length > 0}
                                            onChange={toggleSelectAll}
                                            style={styles.checkbox}
                                        />
                                    </th>
                                    <th style={styles.th}>نام</th>
                                    <th style={styles.th}>ایمیل</th>
                                    <th style={styles.th}>پیام</th>
                                    <th style={styles.th}>تاریخ</th>
                                    <th style={styles.th}>وضعیت</th>
                                    <th style={styles.th}>عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.map(message => (
                                    <tr
                                        key={message.id}
                                        style={{
                                            ...styles.tr,
                                            ...(message.is_read === 0 && styles.unreadRow),
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => viewMessage(message)}
                                        onMouseEnter={(e: React.MouseEvent<HTMLTableRowElement>) => {
                                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                                        }}
                                        onMouseLeave={(e: React.MouseEvent<HTMLTableRowElement>) => {
                                            if (message.is_read === 0) {
                                                e.currentTarget.style.backgroundColor = '#f8f9ff';
                                            } else {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }
                                        }}
                                    >
                                        <td style={styles.td} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedMessages.includes(message.id)}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    if (e.target.checked) {
                                                        setSelectedMessages([...selectedMessages, message.id]);
                                                    } else {
                                                        setSelectedMessages(selectedMessages.filter(id => id !== message.id));
                                                    }
                                                }}
                                                style={styles.checkbox}
                                            />
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.nameCell}>
                                                {message.name}
                                                {message.is_read === 0 && (
                                                    <span style={styles.newBadge}>جدید</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.emailCell}>
                                                <a
                                                    href={`mailto:${message.email}`}
                                                    style={styles.emailLink}
                                                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                                        e.currentTarget.style.color = '#2980b9';
                                                    }}
                                                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                                        e.currentTarget.style.color = '#3498db';
                                                    }}
                                                >
                                                    {message.email}
                                                </a>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.messagePreview}>
                                                {message.message.length > 80
                                                    ? `${message.message.substring(0, 80)}...`
                                                    : message.message}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.dateCell}>
                                                {formatDate(message.created_at)}
                                            </div>
                                        </td>
                                        <td style={styles.td} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                            <button
                                                style={{
                                                    ...styles.statusButton,
                                                    ...(message.is_read === 0
                                                        ? styles.unreadButton
                                                        : styles.readButton)
                                                }}
                                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                    e.stopPropagation();
                                                    toggleReadStatus(message.id, message.is_read);
                                                }}
                                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                    if (message.is_read === 0) {
                                                        e.currentTarget.style.backgroundColor = '#fab1a0';
                                                    } else {
                                                        e.currentTarget.style.backgroundColor = '#81ecec';
                                                    }
                                                }}
                                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                    if (message.is_read === 0) {
                                                        e.currentTarget.style.backgroundColor = '#ffeaa7';
                                                    } else {
                                                        e.currentTarget.style.backgroundColor = '#55efc4';
                                                    }
                                                }}
                                                title={message.is_read === 0 ? 'علامت‌گذاری به عنوان خوانده شده' : 'بازگرداندن به خوانده نشده'}
                                            >
                                                {message.is_read === 0 ? '👁️' : '✓'}
                                            </button>
                                        </td>
                                        <td style={styles.td} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                            <div style={styles.actionButtons}>
                                                <button
                                                    onClick={() => viewMessage(message)}
                                                    style={styles.viewButton}
                                                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                        e.currentTarget.style.backgroundColor = '#2980b9';
                                                    }}
                                                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                        e.currentTarget.style.backgroundColor = '#3498db';
                                                    }}
                                                    title="مشاهده کامل پیام"
                                                >
                                                    🔍 مشاهده
                                                </button>
                                                <button
                                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                        e.stopPropagation();
                                                        handleDeleteMessage(message.id);
                                                    }}
                                                    style={styles.deleteButton}
                                                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                        e.currentTarget.style.backgroundColor = '#c0392b';
                                                    }}
                                                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                        e.currentTarget.style.backgroundColor = '#e74c3c';
                                                    }}
                                                    title="حذف پیام"
                                                >
                                                    🗑️ حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div style={styles.pagination}>
                        <button
                            onClick={() => handleFilterChange('page', filters.page - 1)}
                            disabled={filters.page === 1}
                            style={{
                                ...styles.pageButton,
                                ...(filters.page === 1 && styles.disabledButton)
                            }}
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                if (filters.page !== 1) {
                                    e.currentTarget.style.backgroundColor = '#2980b9';
                                }
                            }}
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                if (filters.page !== 1) {
                                    e.currentTarget.style.backgroundColor = '#3498db';
                                }
                            }}
                        >
                            ← قبلی
                        </button>

                        <div style={styles.pageNumbers}>
                            {generatePageNumbers().map(pageNum => (
                                <button
                                    key={pageNum}
                                    onClick={() => handleFilterChange('page', pageNum)}
                                    style={{
                                        ...styles.pageNumber,
                                        ...(filters.page === pageNum && styles.activePage)
                                    }}
                                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        if (filters.page !== pageNum) {
                                            e.currentTarget.style.backgroundColor = '#f1f1f1';
                                        }
                                    }}
                                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        if (filters.page !== pageNum) {
                                            e.currentTarget.style.backgroundColor = 'white';
                                        }
                                    }}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handleFilterChange('page', filters.page + 1)}
                            disabled={filters.page >= pagination.totalPages}
                            style={{
                                ...styles.pageButton,
                                ...(filters.page >= pagination.totalPages && styles.disabledButton)
                            }}
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                if (filters.page < pagination.totalPages) {
                                    e.currentTarget.style.backgroundColor = '#2980b9';
                                }
                            }}
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                if (filters.page < pagination.totalPages) {
                                    e.currentTarget.style.backgroundColor = '#3498db';
                                }
                            }}
                        >
                            بعدی →
                        </button>
                    </div>
                )}

                {/* مودال نمایش پیام */}
                {showModal && selectedMessage && (
                    <MessageModal
                        message={selectedMessage}
                        onClose={closeModal}
                    />
                )}
            </div>
        </>
    );
};

export default AdminMessages;