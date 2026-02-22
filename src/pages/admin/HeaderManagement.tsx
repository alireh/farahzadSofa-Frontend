import React, { useState, useEffect } from 'react';
import '../../style2/HeaderAdmin.css';

interface HeaderItem {
    id: number;
    title: string;
    link: string;
    parent_id: number;
    order: number;
    is_visible: number;
}

const HeaderAdmin: React.FC = () => {
    const [items, setItems] = useState<HeaderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<HeaderItem | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        parent_id: 0,
        order: 0,
        is_visible: 1
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/header', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setItems(data.data);
            }
        } catch (error) {
            console.error('خطا در دریافت:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editingItem
                ? `/api/admin/header/${editingItem.id}`
                : '/api/admin/header';

            const res = await fetch(url, {
                method: editingItem ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchItems();
                setShowModal(false);
                setEditingItem(null);
                setFormData({ title: '', link: '', parent_id: 0, order: 0, is_visible: 1 });
            }
        } catch (error) {
            console.error('خطا:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('آیا از حذف این آیتم اطمینان دارید؟')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/admin/header/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchItems();
        } catch (error) {
            console.error('خطا در حذف:', error);
        }
    };

    const openEditModal = (item: HeaderItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            link: item.link,
            parent_id: item.parent_id,
            order: item.order,
            is_visible: item.is_visible
        });
        setShowModal(true);
    };

    return (
        <div className="header-admin">
            <div className="admin-header">
                <h1>مدیریت منوی هدر</h1>
                <button
                    className="btn-add"
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ title: '', link: '', parent_id: 0, order: 0, is_visible: 1 });
                        setShowModal(true);
                    }}
                >
                    + آیتم جدید
                </button>
            </div>

            {loading ? (
                <div className="loading">در حال بارگذاری...</div>
            ) : (
                <table className="items-table">
                    <thead>
                        <tr>
                            <th>عنوان</th>
                            <th>لینک</th>
                            <th>ترتیب</th>
                            <th>وضعیت</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.sort((a, b) => a.order - b.order).map(item => (
                            <tr key={item.id}>
                                <td>{item.title}</td>
                                <td>{item.link}</td>
                                <td>{item.order}</td>
                                <td>
                                    <span className={`badge ${item.is_visible ? 'active' : 'inactive'}`}>
                                        {item.is_visible ? 'فعال' : 'غیرفعال'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn-edit"
                                        onClick={() => openEditModal(item)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{editingItem ? 'ویرایش آیتم' : 'آیتم جدید'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>عنوان:</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>لینک:</label>
                                <input
                                    type="text"
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="/products"
                                />
                            </div>
                            <div className="form-group">
                                <label>ترتیب:</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_visible === 1}
                                        onChange={e => setFormData({ ...formData, is_visible: e.target.checked ? 1 : 0 })}
                                    />
                                    فعال
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-save">
                                    ذخیره
                                </button>
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setShowModal(false)}
                                >
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderAdmin;