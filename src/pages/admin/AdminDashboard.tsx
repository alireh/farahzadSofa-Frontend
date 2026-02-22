import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

const AdminDashboard: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // بررسی توکن هنگام لود
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // دریافت اطلاعات کاربر
        fetchUserInfo(token);
    }, []);

    const fetchUserInfo = async (token: string) => {
        try {
            const res = await fetch('/api/admin/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.user);
            } else {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } catch (error) {
            console.error('خطا:', error);
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="admin-dashboard">
            {/* سایدبار */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h3>پنل مدیریت</h3>
                </div>

                {user && (
                    <div className="user-info">
                        <p>خوش آمدید، {user.full_name || user.username}</p>
                    </div>
                )}

                <nav className="sidebar-nav">
                    <Link to="/admin" className="nav-item">داشبورد</Link>
                    <Link to="/admin/header" className="nav-item">مدیریت منو</Link>
                </nav>

                <button onClick={handleLogout} className="logout-btn">
                    خروج
                </button>
            </aside>

            {/* محتوای اصلی */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;