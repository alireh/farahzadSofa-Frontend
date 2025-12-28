// components/SocialLinksManager.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SocialLink } from '../types';
const Host_Url = process.env.REACT_APP_HOST_URL;

interface SocialLinksManagerProps {
    onClose?: () => void;
}

const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({ onClose }) => {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // حالت‌های فرم جدید
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPlatform, setNewPlatform] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [newIconFile, setNewIconFile] = useState<File | null>(null);
    const [newDisplayOrder, setNewDisplayOrder] = useState(0);

    // حالت‌های ویرایش
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editPlatform, setEditPlatform] = useState('');
    const [editUrl, setEditUrl] = useState('');
    const [editIconFile, setEditIconFile] = useState<File | null>(null);
    const [editIsActive, setEditIsActive] = useState(true);
    const [editDisplayOrder, setEditDisplayOrder] = useState(0);
    const [removeIcon, setRemoveIcon] = useState(false);

    // برای نمایش پیش‌نمایش آیکون
    const [newIconPreview, setNewIconPreview] = useState<string | null>(null);
    const [editIconPreview, setEditIconPreview] = useState<string | null>(null);

    useEffect(() => {
        fetchSocialLinks();
    }, []);

    const fetchSocialLinks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${Host_Url}/api/admin/socials`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSocialLinks(response.data);
            setError(null);
        } catch (error: any) {
            setError('خطا در دریافت شبکه‌های اجتماعی');
            console.error('Error fetching social links:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
        const file = e.target.files?.[0];
        if (file) {
            // بررسی نوع فایل
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                setError('لطفا فقط فایل‌های JPEG یا PNG انتخاب کنید');
                return;
            }

            // بررسی حجم فایل (حداکثر 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('حجم فایل باید کمتر از 2 مگابایت باشد');
                return;
            }

            // ایجاد پیش‌نمایش
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isEdit) {
                    setEditIconPreview(reader.result as string);
                    setEditIconFile(file);
                } else {
                    setNewIconPreview(reader.result as string);
                    setNewIconFile(file);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddSocialLink = async () => {
        if (!newPlatform.trim() || !newUrl.trim()) {
            setError('نام پلتفرم و آدرس URL الزامی هستند');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('platform', newPlatform.trim());
            formData.append('url', newUrl.trim());
            formData.append('display_order', newDisplayOrder.toString());

            if (newIconFile) {
                formData.append('icon', newIconFile);
            }

            const token = localStorage.getItem('token');
            await axios.post(`${Host_Url}/api/admin/socials`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess('شبکه اجتماعی جدید با موفقیت اضافه شد');
            resetAddForm();
            fetchSocialLinks();
        } catch (error: any) {
            setError(error.response?.data?.error || 'خطا در افزودن شبکه اجتماعی');
        }
    };

    const handleUpdateSocialLink = async (id: number) => {
        try {
            const formData = new FormData();
            formData.append('platform', editPlatform.trim());
            formData.append('url', editUrl.trim());
            formData.append('is_active', editIsActive.toString());
            formData.append('display_order', editDisplayOrder.toString());

            if (editIconFile) {
                formData.append('icon', editIconFile);
            }

            if (removeIcon) {
                formData.append('remove_icon', 'true');
            }

            const token = localStorage.getItem('token');
            await axios.put(`${Host_Url}/api/admin/socials/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess('شبکه اجتماعی با موفقیت به‌روزرسانی شد');
            cancelEdit();
            fetchSocialLinks();
        } catch (error: any) {
            setError(error.response?.data?.error || 'خطا در به‌روزرسانی شبکه اجتماعی');
        }
    };

    const handleDeleteSocialLink = async (id: number, platform: string) => {
        if (!window.confirm(`آیا از حذف شبکه اجتماعی "${platform}" مطمئن هستید؟`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${Host_Url}/api/admin/socials/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess(`شبکه اجتماعی "${platform}" با موفقیت حذف شد`);
            fetchSocialLinks();
        } catch (error: any) {
            setError(error.response?.data?.error || 'خطا در حذف شبکه اجتماعی');
        }
    };

    const handleToggleActive = async (id: number, currentActive: boolean) => {
        try {
            const link = socialLinks.find(l => l.id === id);
            if (!link) return;

            const formData = new FormData();
            formData.append('is_active', (!currentActive).toString());

            const token = localStorage.getItem('token');
            await axios.put(`${Host_Url}/api/admin/socials/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess(`وضعیت نمایش ${currentActive ? 'غیرفعال' : 'فعال'} شد`);
            fetchSocialLinks();
        } catch (error: any) {
            setError('خطا در تغییر وضعیت نمایش');
        }
    };

    const startEdit = (link: SocialLink) => {
        setEditingId(link.id);
        setEditPlatform(link.platform);
        setEditUrl(link.url);
        setEditIsActive(link.is_active);
        setEditDisplayOrder(link.display_order);
        setEditIconFile(null);
        setEditIconPreview(null);
        setRemoveIcon(false);

        if (link.icon) {
            setEditIconPreview(`${Host_Url}${link.icon}`);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditPlatform('');
        setEditUrl('');
        setEditIsActive(true);
        setEditDisplayOrder(0);
        setEditIconFile(null);
        setEditIconPreview(null);
        setRemoveIcon(false);
    };

    const resetAddForm = () => {
        setNewPlatform('');
        setNewUrl('');
        setNewIconFile(null);
        setNewIconPreview(null);
        setNewDisplayOrder(0);
        setShowAddForm(false);
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingText}>در حال بارگذاری...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>مدیریت شبکه‌های اجتماعی</h2>
                {onClose && (
                    <button onClick={onClose} style={styles.closeButton}>
                        ×
                    </button>
                )}
            </div>

            {/* پیام‌های خطا و موفقیت */}
            {error && (
                <div style={styles.errorMessage} className='mt-1'>
                    {error}
                    <button onClick={() => setError(null)} style={styles.closeMessageButton}>
                        ×
                    </button>
                </div>
            )}

            {success && (
                <div style={styles.successMessage} className='mt-1'>
                    {success}
                    <button onClick={() => setSuccess(null)} style={styles.closeMessageButton}>
                        ×
                    </button>
                </div>
            )}

            {/* دکمه افزودن جدید */}
            <div style={styles.addButtonContainer} className='mt-1'>
                <button
                    onClick={() => setShowAddForm(true)}
                    style={styles.addButton}
                    disabled={showAddForm}
                >
                    + افزودن شبکه اجتماعی جدید
                </button>
            </div>

            {/* فرم افزودن جدید */}
            {showAddForm && (
                <div style={styles.addForm}>
                    <h3 style={styles.formTitle}>افزودن شبکه اجتماعی جدید</h3>

                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                نام پلتفرم *
                                <input
                                    type="text"
                                    value={newPlatform}
                                    onChange={(e) => setNewPlatform(e.target.value)}
                                    placeholder="مثال: اینستاگرام، تلگرام، واتساپ"
                                    style={styles.textInput}
                                />
                            </label>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                آدرس URL *
                                <input
                                    type="text"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    placeholder="https://instagram.com/username"
                                    style={styles.textInput}
                                />
                            </label>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                آیکون (اختیاری)
                                <div style={styles.fileUploadArea}>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={(e) => handleFileSelect(e, false)}
                                        style={styles.fileInput}
                                        id="newIconUpload"
                                    />
                                    <label htmlFor="newIconUpload" style={styles.fileLabel}>
                                        {newIconFile ? newIconFile.name : 'انتخاب تصویر (JPG/PNG)'}
                                    </label>
                                    {newIconFile && (
                                        <button
                                            onClick={() => {
                                                setNewIconFile(null);
                                                setNewIconPreview(null);
                                            }}
                                            style={styles.clearFileButton}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                {newIconPreview && (
                                    <div style={styles.iconPreviewContainer}>
                                        <img
                                            src={newIconPreview}
                                            alt="پیش‌نمایش آیکون"
                                            style={styles.iconPreview}
                                        />
                                        <span style={styles.previewText}>پیش‌نمایش آیکون</span>
                                    </div>
                                )}
                                <small style={styles.helpText}>
                                    حداکثر 2 مگابایت - فرمت‌های مجاز: JPG, PNG
                                </small>
                            </label>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                ترتیب نمایش
                                <input
                                    type="number"
                                    value={newDisplayOrder}
                                    onChange={(e) => setNewDisplayOrder(parseInt(e.target.value) || 0)}
                                    style={styles.numberInput}
                                    min="0"
                                    max="100"
                                />
                            </label>
                        </div>
                    </div>

                    <div style={styles.formActions}>
                        <button
                            onClick={handleAddSocialLink}
                            style={styles.submitButton}
                            disabled={!newPlatform.trim() || !newUrl.trim()}
                        >
                            ذخیره
                        </button>
                        <button
                            onClick={resetAddForm}
                            style={styles.cancelButton}
                        >
                            انصراف
                        </button>
                    </div>
                </div>
            )}

            {/* لیست شبکه‌های اجتماعی */}
            <div style={styles.listContainer}>
                {socialLinks.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📱</div>
                        <h3 style={styles.emptyTitle}>هیچ شبکه اجتماعی‌ای ثبت نشده است</h3>
                        <p style={styles.emptyText}>
                            برای شروع، اولین شبکه اجتماعی خود را اضافه کنید.
                        </p>
                    </div>
                ) : (
                    <div style={styles.list}>
                        {socialLinks.map((link) => (
                            <div key={link.id} style={styles.listItem}>
                                {editingId === link.id ? (
                                    // فرم ویرایش
                                    <div style={styles.editForm}>
                                        <div style={styles.editFormHeader}>
                                            <h4 style={styles.editTitle}>ویرایش {link.platform}</h4>
                                        </div>

                                        <div style={styles.editFormGrid}>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>
                                                    نام پلتفرم
                                                    <input
                                                        type="text"
                                                        value={editPlatform}
                                                        onChange={(e) => setEditPlatform(e.target.value)}
                                                        style={styles.textInput}
                                                    />
                                                </label>
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>
                                                    آدرس URL
                                                    <input
                                                        type="text"
                                                        value={editUrl}
                                                        onChange={(e) => setEditUrl(e.target.value)}
                                                        style={styles.textInput}
                                                    />
                                                </label>
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>
                                                    وضعیت نمایش
                                                    <select
                                                        value={editIsActive.toString()}
                                                        onChange={(e) => setEditIsActive(e.target.value === 'true')}
                                                        style={styles.selectInput}
                                                    >
                                                        <option value="true">فعال</option>
                                                        <option value="false">غیرفعال</option>
                                                    </select>
                                                </label>
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>
                                                    ترتیب نمایش
                                                    <input
                                                        type="number"
                                                        value={editDisplayOrder}
                                                        onChange={(e) => setEditDisplayOrder(parseInt(e.target.value) || 0)}
                                                        style={styles.numberInput}
                                                        min="0"
                                                        max="100"
                                                    />
                                                </label>
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>
                                                    آیکون
                                                    <div style={styles.fileUploadArea}>
                                                        <input
                                                            type="file"
                                                            accept=".jpg,.jpeg,.png"
                                                            onChange={(e) => handleFileSelect(e, true)}
                                                            style={styles.fileInput}
                                                            id={`editIconUpload-${link.id}`}
                                                        />
                                                        <label
                                                            htmlFor={`editIconUpload-${link.id}`}
                                                            style={styles.fileLabel}
                                                        >
                                                            {editIconFile ? editIconFile.name : 'انتخاب تصویر جدید'}
                                                        </label>
                                                        {editIconFile && (
                                                            <button
                                                                onClick={() => {
                                                                    setEditIconFile(null);
                                                                    setEditIconPreview(null);
                                                                }}
                                                                style={styles.clearFileButton}
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </div>

                                                    {editIconPreview && (
                                                        <div style={styles.iconPreviewContainer}>
                                                            <img
                                                                src={editIconPreview}
                                                                alt="پیش‌نمایش آیکون"
                                                                style={styles.iconPreview}
                                                            />
                                                            <span style={styles.previewText}>آیکون جدید</span>
                                                        </div>
                                                    )}

                                                    {link.icon && !editIconPreview && (
                                                        <div style={styles.currentIconContainer}>
                                                            <img
                                                                src={`${Host_Url}${link.icon}`}
                                                                alt={link.platform}
                                                                style={styles.currentIcon}
                                                            />
                                                            <span style={styles.currentIconText}>آیکون فعلی</span>
                                                            <button
                                                                onClick={() => setRemoveIcon(true)}
                                                                style={styles.removeIconButton}
                                                            >
                                                                حذف آیکون
                                                            </button>
                                                        </div>
                                                    )}

                                                    {removeIcon && (
                                                        <div style={styles.removeIconWarning}>
                                                            <span style={styles.warningIcon}>⚠️</span>
                                                            آیکون فعلی حذف خواهد شد
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>

                                        <div style={styles.editActions}>
                                            <button
                                                onClick={() => handleUpdateSocialLink(link.id)}
                                                style={styles.saveButton}
                                            >
                                                ذخیره تغییرات
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                style={styles.cancelEditButton}
                                            >
                                                انصراف
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // نمایش اطلاعات
                                    <div style={styles.itemContent}>
                                        <div style={styles.itemInfo}>
                                            <div style={styles.itemIcon}>
                                                {link.icon ? (
                                                    <img
                                                        src={`${Host_Url}${link.icon}`}
                                                        alt={link.platform}
                                                        style={styles.iconImage}
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.parentElement!.innerHTML =
                                                                `<div style="${styles.fallbackIcon}">${link.platform.charAt(0)}</div>`;
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={styles.fallbackIcon}>
                                                        {link.platform.charAt(0)}
                                                    </div>
                                                )}
                                            </div>

                                            <div style={styles.itemDetails}>
                                                <div style={styles.itemHeader}>
                                                    <h4 style={styles.itemTitle}>{link.platform}</h4>
                                                    <div style={styles.itemMeta}>
                                                        <span style={styles.orderBadge}>
                                                            ترتیب: {link.display_order}
                                                        </span>
                                                        <span style={link.is_active ? styles.activeBadge : styles.inactiveBadge}>
                                                            {link.is_active ? 'فعال' : 'غیرفعال'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style={styles.itemUrl}>
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={styles.urlLink}
                                                    >
                                                        {link.url}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={styles.itemActions}>
                                            <button
                                                onClick={() => startEdit(link)}
                                                style={styles.editItemButton}
                                            >
                                                ویرایش
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(link.id, link.is_active)}
                                                style={link.is_active ? styles.deactivateButton : styles.activateButton}
                                            >
                                                {link.is_active ? 'غیرفعال' : 'فعال'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSocialLink(link.id, link.platform)}
                                                style={styles.deleteItemButton}
                                            >
                                                حذف
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// استایل‌ها (کاملاً سفارشی‌شده)
const styles = {
    container: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        fontFamily: 'Vazir, Arial, sans-serif',
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e9ecef',
    },

    title: {
        margin: 0,
        color: '#2d3748',
        fontSize: '24px',
        fontWeight: '600',
    },

    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '28px',
        color: '#718096',
        cursor: 'pointer',
        padding: '0',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#e2e8f0',
        },
    },

    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
    },

    loadingText: {
        color: '#718096',
        fontSize: '16px',
    },

    errorMessage: {
        backgroundColor: '#fed7d7',
        color: '#9b2c2c',
        padding: '16px',
        margin: '0 24px 24px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    successMessage: {
        backgroundColor: '#c6f6d5',
        color: '#276749',
        padding: '16px',
        margin: '0 24px 24px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    closeMessageButton: {
        background: 'none',
        border: 'none',
        color: 'inherit',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '0 0 0 16px',
    },

    addButtonContainer: {
        padding: '0 24px 24px',
    },

    addButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#3d8b40',
        },
        ':disabled': {
            backgroundColor: '#a5d6a7',
            cursor: 'not-allowed',
        },
    },

    addForm: {
        backgroundColor: '#f8f9fa',
        margin: '0 24px 24px',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
    },

    formTitle: {
        marginTop: 0,
        marginBottom: '24px',
        color: '#2d3748',
        fontSize: '18px',
        fontWeight: '600',
    },

    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '24px',
    },

    formGroup: {
        marginBottom: '16px',
    },

    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#4a5568',
        fontSize: '14px',
        fontWeight: '500',
    },

    textInput: {
        width: '100%',
        padding: '12px',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
        ':focus': {
            outline: 'none',
            borderColor: '#4CAF50',
            boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
        },
    },

    numberInput: {
        width: '100%',
        padding: '12px',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box',
    },

    selectInput: {
        width: '100%',
        padding: '12px',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box',
        backgroundColor: 'white',
    },

    fileUploadArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },

    fileInput: {
        display: 'none',
    },

    fileLabel: {
        flex: 1,
        padding: '12px',
        border: '2px dashed #cbd5e0',
        borderRadius: '6px',
        cursor: 'pointer',
        textAlign: 'center',
        color: '#718096',
        fontSize: '14px',
        transition: 'border-color 0.2s',
        ':hover': {
            borderColor: '#4CAF50',
        },
    },

    clearFileButton: {
        background: 'none',
        border: 'none',
        color: '#e53e3e',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '4px',
        ':hover': {
            backgroundColor: '#fed7d7',
        },
    },

    iconPreviewContainer: {
        marginTop: '12px',
        textAlign: 'center',
    },

    iconPreview: {
        width: '80px',
        height: '80px',
        objectFit: 'contain',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        backgroundColor: 'white',
        padding: '8px',
    },

    previewText: {
        display: 'block',
        fontSize: '12px',
        color: '#718096',
        marginTop: '4px',
    },

    helpText: {
        display: 'block',
        marginTop: '8px',
        color: '#a0aec0',
        fontSize: '12px',
    },

    currentIconContainer: {
        marginTop: '12px',
        textAlign: 'center',
    },

    currentIcon: {
        width: '80px',
        height: '80px',
        objectFit: 'contain',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        backgroundColor: 'white',
        padding: '8px',
    },

    currentIconText: {
        display: 'block',
        fontSize: '12px',
        color: '#718096',
        marginTop: '4px',
    },

    removeIconButton: {
        backgroundColor: '#fed7d7',
        color: '#9b2c2c',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        cursor: 'pointer',
        marginTop: '8px',
        ':hover': {
            backgroundColor: '#feb2b2',
        },
    },

    removeIconWarning: {
        backgroundColor: '#feebc8',
        color: '#9c4221',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },

    warningIcon: {
        fontSize: '16px',
    },

    formActions: {
        display: 'flex',
        gap: '12px',
    },

    submitButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        flex: 1,
        ':hover': {
            backgroundColor: '#3d8b40',
        },
        ':disabled': {
            backgroundColor: '#a5d6a7',
            cursor: 'not-allowed',
        },
    },

    cancelButton: {
        backgroundColor: '#e2e8f0',
        color: '#4a5568',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        flex: 1,
        ':hover': {
            backgroundColor: '#cbd5e0',
        },
    },

    listContainer: {
        padding: '0 24px 24px',
    },

    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#718096',
    },

    emptyIcon: {
        fontSize: '64px',
        marginBottom: '20px',
    },

    emptyTitle: {
        margin: '0 0 12px',
        color: '#4a5568',
        fontSize: '20px',
        fontWeight: '600',
    },

    emptyText: {
        margin: 0,
        fontSize: '14px',
    },

    list: {},

    listItem: {
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginBottom: '16px',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
        ':hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
    },

    editForm: {
        padding: '24px',
    },

    editFormHeader: {
        marginBottom: '20px',
    },

    editTitle: {
        margin: 0,
        color: '#2d3748',
        fontSize: '18px',
        fontWeight: '600',
    },

    editFormGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '24px',
    },

    editActions: {
        display: 'flex',
        gap: '12px',
    },

    saveButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        flex: 1,
        ':hover': {
            backgroundColor: '#3d8b40',
        },
    },

    cancelEditButton: {
        backgroundColor: '#e2e8f0',
        color: '#4a5568',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        flex: 1,
        ':hover': {
            backgroundColor: '#cbd5e0',
        },
    },

    itemContent: {
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    itemInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flex: 1,
    },

    itemIcon: {
        flexShrink: 0,
    },

    iconImage: {
        width: '60px',
        height: '60px',
        objectFit: 'contain',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '8px',
        backgroundColor: 'white',
    },

    fallbackIcon: {
        width: '60px',
        height: '60px',
        backgroundColor: '#4CAF50',
        color: 'white',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
    },

    itemDetails: {
        flex: 1,
        minWidth: 0,
    },

    itemHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        flexWrap: 'wrap',
        gap: '8px',
    },

    itemTitle: {
        margin: 0,
        color: '#2d3748',
        fontSize: '18px',
        fontWeight: '600',
    },

    itemMeta: {
        display: 'flex',
        gap: '8px',
    },

    orderBadge: {
        backgroundColor: '#e2e8f0',
        color: '#4a5568',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
    },

    activeBadge: {
        backgroundColor: '#c6f6d5',
        color: '#276749',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
    },

    inactiveBadge: {
        backgroundColor: '#fed7d7',
        color: '#9b2c2c',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
    },

    itemUrl: {
        marginTop: '4px',
    },

    urlLink: {
        color: '#3182ce',
        textDecoration: 'none',
        fontSize: '14px',
        wordBreak: 'break-all',
        ':hover': {
            textDecoration: 'underline',
        },
    },

    itemActions: {
        display: 'flex',
        gap: '8px',
        flexShrink: 0,
    },

    editItemButton: {
        backgroundColor: '#3182ce',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
        ':hover': {
            backgroundColor: '#2c5282',
        },
    },

    deactivateButton: {
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
        ':hover': {
            backgroundColor: '#c53030',
        },
    },

    activateButton: {
        backgroundColor: '#38a169',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
        ':hover': {
            backgroundColor: '#2f855a',
        },
    },

    deleteItemButton: {
        backgroundColor: '#718096',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
        ':hover': {
            backgroundColor: '#4a5568',
        },
    },
} as const;

export default SocialLinksManager;