import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SocialLink } from '../types';

const AdminSocialLinks: React.FC = () => {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // حالت‌های فرم جدید
    const [newPlatform, setNewPlatform] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [newIcon, setNewIcon] = useState('');
    const [newDisplayOrder, setNewDisplayOrder] = useState(99);

    // حالت‌های ویرایش
    const [editingLink, setEditingLink] = useState<number | null>(null);
    const [editUrl, setEditUrl] = useState('');
    const [editIcon, setEditIcon] = useState('');
    const [editDisplayOrder, setEditDisplayOrder] = useState(0);

    useEffect(() => {
        fetchSocialLinks();
    }, []);

    const fetchSocialLinks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/social-links', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSocialLinks(response.data);
        } catch (error) {
            console.error('Error fetching social links:', error);
            setError('خطا در دریافت اطلاعات شبکه‌های اجتماعی');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSocialLink = async () => {
        if (!newPlatform || !newUrl) {
            setError('نام پلتفرم و URL الزامی است');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/api/admin/social-links', {
                platform: newPlatform,
                url: newUrl,
                icon: newIcon || newPlatform,
                display_order: newDisplayOrder
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('لینک شبکه اجتماعی با موفقیت اضافه شد');
            setNewPlatform('');
            setNewUrl('');
            setNewIcon('');
            setNewDisplayOrder(99);
            fetchSocialLinks();
        } catch (error: any) {
            setError(error.response?.data?.error || 'خطا در افزودن لینک');
        }
    };

    const handleUpdateSocialLink = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/social-links/${id}`, {
                url: editUrl,
                icon: editIcon,
                display_order: editDisplayOrder
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('لینک شبکه اجتماعی با موفقیت بروزرسانی شد');
            setEditingLink(null);
            fetchSocialLinks();
        } catch (error: any) {
            setError(error.response?.data?.error || 'خطا در بروزرسانی لینک');
        }
    };

    const handleToggleSocialLink = async (id: number, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/social-links/${id}`, {
                is_active: !currentStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('وضعیت لینک با موفقیت تغییر کرد');
            fetchSocialLinks();
        } catch (error: any) {
            setError(error.response?.data?.error || 'خطا در تغییر وضعیت لینک');
        }
    };

    const handleDeleteSocialLink = async (id: number, platform: string) => {
        if (!window.confirm(`آیا از حذف/غیرفعال کردن ${platform} مطمئن هستید؟`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5000/api/admin/social-links/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess(response.data.message || 'عملیات با موفقیت انجام شد');
            fetchSocialLinks();
        } catch (error: any) {
            setError(error.response?.data?.error || 'خطا در حذف لینک');
        }
    };

    const handleUpdateOrder = async () => {
        const order = socialLinks.map((link, index) => ({
            id: link.id,
            display_order: index + 1
        }));

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/api/admin/social-links/order', { order }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('ترتیب نمایش با موفقیت بروزرسانی شد');
            fetchSocialLinks();
        } catch (error: any) {
            setError(error.response?.data?.error || 'خطا در بروزرسانی ترتیب');
        }
    };

    const renderIconPreview = (iconName: string) => {
        const iconMap: Record<string, string> = {
            'telegram': '📱',
            'instagram': '📸',
            'pinterest': '📌',
            'aparat': '🎥',
            'youtube': '▶️',
            'whatsapp': '💬',
            'twitter': '🐦',
            'facebook': '📘',
            'linkedin': '💼',
            'tiktok': '🎵'
        };

        return iconMap[iconName] || '🔗';
    };

    if (loading) return <div>در حال بارگذاری...</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>مدیریت شبکه‌های اجتماعی</h2>

            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}

            {/* فرم افزودن لینک جدید */}
            <div style={styles.addForm}>
                <h3>افزودن شبکه اجتماعی جدید</h3>
                <div style={styles.formGrid}>
                    <input
                        type="text"
                        placeholder="نام پلتفرم (مثال: twitter)"
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value)}
                        style={styles.textInput}
                    />
                    <input
                        type="text"
                        placeholder="URL کامل"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        style={styles.textInput}
                    />
                    <input
                        type="text"
                        placeholder="نام آیکون (اختیاری)"
                        value={newIcon}
                        onChange={(e) => setNewIcon(e.target.value)}
                        style={styles.textInput}
                    />
                    <input
                        type="number"
                        placeholder="ترتیب نمایش"
                        value={newDisplayOrder}
                        onChange={(e) => setNewDisplayOrder(parseInt(e.target.value))}
                        style={styles.numberInput}
                    />
                    <button
                        onClick={handleAddSocialLink}
                        style={styles.addButton}
                    >
                        افزودن لینک جدید
                    </button>
                </div>
            </div>

            {/* لیست شبکه‌های اجتماعی */}
            <div style={styles.socialLinksList}>
                <div style={styles.listHeader}>
                    <span style={styles.headerItem}>ترتیب</span>
                    <span style={styles.headerItem}>پلتفرم</span>
                    <span style={styles.headerItem}>آیکون</span>
                    <span style={styles.headerItem}>URL</span>
                    <span style={styles.headerItem}>وضعیت</span>
                    <span style={styles.headerItem}>عملیات</span>
                </div>

                {socialLinks.map((link) => (
                    <div key={link.id} style={styles.socialLinkItem}>
                        <span style={styles.orderCell}>
                            {link.display_order}
                        </span>
                        <span style={styles.platformCell}>
                            {link.platform}
                        </span>
                        <span style={styles.iconCell}>
                            <span style={styles.iconPreview}>
                                {renderIconPreview(link.icon)}
                            </span>
                            <span style={styles.iconName}>{link.icon}</span>
                        </span>
                        <span style={styles.urlCell}>
                            {link.url}
                        </span>
                        <span
                        // style={styles.statusCell}
                        >
                            <button
                                onClick={() => handleToggleSocialLink(link.id, link.is_active)}
                                style={link.is_active ? styles.activeButton : styles.inactiveButton}
                            >
                                {link.is_active ? 'فعال' : 'غیرفعال'}
                            </button>
                        </span>
                        <span style={styles.actionsCell}>
                            <button
                                onClick={() => {
                                    setEditingLink(link.id);
                                    setEditUrl(link.url);
                                    setEditIcon(link.icon);
                                    setEditDisplayOrder(link.display_order);
                                }}
                                style={styles.editButton}
                            >
                                ویرایش
                            </button>
                            <button
                                onClick={() => handleDeleteSocialLink(link.id, link.platform)}
                                style={styles.deleteButton}
                            >
                                {['telegram', 'instagram', 'pinterest', 'aparat', 'youtube', 'whatsapp']
                                    .includes(link.platform) ? 'غیرفعال' : 'حذف'}
                            </button>
                        </span>

                        {/* فرم ویرایش */}
                        {editingLink === link.id && (
                            <div style={styles.editForm}>
                                <div style={styles.editGrid}>
                                    <input
                                        type="text"
                                        value={editUrl}
                                        onChange={(e) => setEditUrl(e.target.value)}
                                        placeholder="آدرس URL"
                                        style={styles.textInput}
                                    />
                                    <input
                                        type="text"
                                        value={editIcon}
                                        onChange={(e) => setEditIcon(e.target.value)}
                                        placeholder="نام آیکون"
                                        style={styles.textInput}
                                    />
                                    <input
                                        type="number"
                                        value={editDisplayOrder}
                                        onChange={(e) => setEditDisplayOrder(parseInt(e.target.value))}
                                        placeholder="ترتیب نمایش"
                                        style={styles.numberInput}
                                    />
                                    <button
                                        onClick={() => handleUpdateSocialLink(link.id)}
                                        style={styles.saveButton}
                                    >
                                        ذخیره تغییرات
                                    </button>
                                    <button
                                        onClick={() => setEditingLink(null)}
                                        style={styles.cancelButton}
                                    >
                                        لغو
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* دکمه بروزرسانی ترتیب */}
            <div
            // style={styles.orderActions}
            >
                <button
                    onClick={handleUpdateOrder}
                    style={styles.orderButton}
                >
                    بروزرسانی ترتیب نمایش
                </button>
                <p style={styles.helpText}>
                    * برای تغییر ترتیب، آیتم‌ها را در لیست بالا مرتب کرده و سپس این دکمه را بزنید
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px',
    },
    title: {
        color: '#333',
        marginBottom: '20px',
        fontSize: '24px',
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '15px',
    },
    success: {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '15px',
    },
    addForm: {
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '6px',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        alignItems: 'end',
    },
    textInput: {
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
    },
    numberInput: {
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        width: '100px',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    socialLinksList: {
        marginBottom: '20px',
    },
    listHeader: {
        display: 'grid',
        gridTemplateColumns: '80px 120px 100px 1fr 100px 200px',
        gap: '10px',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        marginBottom: '10px',
        fontWeight: 'bold',
    },
    headerItem: {
        padding: '5px',
    },
    socialLinkItem: {
        display: 'grid',
        gridTemplateColumns: '80px 120px 100px 1fr 100px 200px',
        gap: '10px',
        padding: '15px 10px',
        borderBottom: '1px solid #eee',
        alignItems: 'center',
    },
    orderCell: {
        fontWeight: 'bold',
        color: '#666',
    },
    platformCell: {
        fontWeight: 'bold',
    },
    iconCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    iconPreview: {
        fontSize: '20px',
    },
    iconName: {
        fontSize: '12px',
        color: '#666',
    },
    urlCell: {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#0066cc',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    statusCell: {
        textAlign: 'center',
    },
    actionsCell: {
        display: 'flex',
        gap: '5px',
    },
    activeButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    },
    inactiveButton: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    },
    editButton: {
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    },
    deleteButton: {
        backgroundColor: '#ff9800',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    },
    editForm: {
        gridColumn: '1 / -1',
        marginTop: '10px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
    },
    editGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    cancelButton: {
        backgroundColor: '#9e9e9e',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    orderActions: {
        textAlign: 'center',
        marginTop: '20px',
    },
    orderButton: {
        backgroundColor: '#9C27B0',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    helpText: {
        fontSize: '12px',
        color: '#666',
        marginTop: '5px',
    },
};

export default AdminSocialLinks;