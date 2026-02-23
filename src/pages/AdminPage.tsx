// src/pages/AdminPage.tsx
import React, { useEffect, useState } from "react";
import Modal from "../component2/Modal";
import "../style2/adminPage.css";
import "../style2/admin-hero.css";
import "../style2/admin-collection.css";

interface MenuItem {
  id: number;
  title: string;
  url: string;
  order_index: number;
}

interface HeroData {
  desktop_image: string;
  mobile_image: string;
}

interface CollectionItem {
  id: number;
  title: string;
  desktop_image: string;
  mobile_image: string;
}

const AdminPage: React.FC = () => {
  const token = localStorage.getItem("token");

  // تب‌ها
  const [activeTab, setActiveTab] = useState<"menu" | "hero" | "collection">(
    "menu"
  );

  // ===== Menu states =====
  const [items, setItems] = useState<MenuItem[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("#");
  const [orderIndex, setOrderIndex] = useState(0);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // ===== Hero states =====
  const [hero, setHero] = useState<HeroData | null>(null);
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);

  // ===== Collection states =====
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // ===== Protect admin =====
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchMenu();
    fetchHero();
    fetchCollections();
  }, []);

  // ===== Menu CRUD =====
  const fetchMenu = async () => {
    const res = await fetch("/api/menu");
    const data = await res.json();
    setItems(data);
  };

  const addItem = async () => {
    if (!title) return;
    await fetch("/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, url, order_index: orderIndex }),
    });
    setTitle("");
    setUrl("#");
    setOrderIndex(0);
    fetchMenu();
  };

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setEditTitle(item.title);
  };

  const submitEdit = async () => {
    if (!editItem) return;
    await fetch(`/api/menu/${editItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...editItem, title: editTitle }),
    });
    setEditItem(null);
    fetchMenu();
  };

  const deleteItem = async (id: number) => {
    await fetch(`/api/menu/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMenu();
  };

  // ===== Hero CRUD =====
  const fetchHero = async () => {
    const res = await fetch("/api/hero");
    const data = await res.json();
    setHero(data);
  };

  const uploadHero = async () => {
    if (!desktopFile && !mobileFile) {
      alert("هیچ فایلی انتخاب نشده!");
      return;
    }
    const formData = new FormData();
    desktopFile && formData.append("desktop", desktopFile);
    mobileFile && formData.append("mobile", mobileFile);

    try {
      const res = await fetch("/api/hero", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert("تصاویر Hero با موفقیت آپلود شد!");
        setDesktopFile(null);
        setMobileFile(null);
        fetchHero();
      }
    } catch (err) {
      console.error(err);
      alert("خطا در آپلود تصاویر");
    }
  };

  // ===== Collection CRUD =====
  const fetchCollections = async () => {
    try {
      const res = await fetch("/api/collections");
      const data = await res.json();
      setCollections(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addCollection = async () => {
    if (!title || !desktopFile || !mobileFile)
      return alert("عنوان و تصاویر را انتخاب کنید");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("desktop", desktopFile);
    formData.append("mobile", mobileFile);

    try {
      const res = await fetch("/api/collections", { method: "POST", body: formData });
      const newCollection = await res.json();
      setCollections([...collections, newCollection]);
      setTitle("");
      setDesktopFile(null);
      setMobileFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  const editCollection = (c: CollectionItem) => {
    setEditingId(c.id);
    setTitle(c.title);
    setDesktopFile(null);
    setMobileFile(null);
  };

  const saveEditCollection = async () => {
    if (editingId === null) return;
    const formData = new FormData();
    formData.append("title", title);
    desktopFile && formData.append("desktop", desktopFile);
    mobileFile && formData.append("mobile", mobileFile);

    try {
      const res = await fetch(`/api/collections/${editingId}`, {
        method: "PUT",
        body: formData,
      });
      const updated = await res.json();
      setCollections(
        collections.map((c) => (c.id === editingId ? updated : c))
      );
      setEditingId(null);
      setTitle("");
      setDesktopFile(null);
      setMobileFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCollection = async (id: number) => {
    if (!window.confirm("آیا مطمئن هستید که می‌خواهید این کالکشن را حذف کنید؟"))
      return;
    try {
      await fetch(`/api/collections/${id}`, { method: "DELETE" });
      setCollections(collections.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <ul>
          <li className={activeTab === "menu" ? "active" : ""} onClick={() => setActiveTab("menu")}>
            مدیریت لینک‌های بالای سایت
          </li>
          <li className={activeTab === "hero" ? "active" : ""} onClick={() => setActiveTab("hero")}>
            مدیریت تصویر هدر
          </li>
          <li className={activeTab === "collection" ? "active" : ""} onClick={() => setActiveTab("collection")}>
            مدیریت کالکشن‌ها
          </li>
        </ul>
      </aside>

      {/* Content */}
      <main className="content">
        {/* ----- Menu Tab ----- */}
        {activeTab === "menu" && (
          <>
            <h2>مدیریت منو</h2>
            <div className="menu-form">
              <input placeholder="عنوان" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input placeholder="url" value={url} onChange={(e) => setUrl(e.target.value)} />
              <input type="number" placeholder="ترتیب" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} />
              <button onClick={addItem}>➕ افزودن</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>عنوان</th>
                  <th>لینک</th>
                  <th>ترتیب</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {items.map((x) => (
                  <tr key={x.id}>
                    <td>{x.title}</td>
                    <td>{x.url}</td>
                    <td>{x.order_index}</td>
                    <td>
                      <button onClick={() => openEdit(x)}>✏️</button>
                      <button onClick={() => deleteItem(x.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Modal open={!!editItem} title="ویرایش آیتم" onClose={() => setEditItem(null)}>
              <input style={{ width: "100%", marginBottom: 12 }} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <button onClick={submitEdit}>💾 ذخیره</button>
            </Modal>
          </>
        )}

        {/* ----- Hero Tab ----- */}
        {activeTab === "hero" && (
          <div className="hero-upload-container">
            <h3>مدیریت تصویر Hero</h3>
            <input type="file" accept="image/*" onChange={(e) => setDesktopFile(e.target.files ? e.target.files[0] : null)} />
            <input type="file" accept="image/*" onChange={(e) => setMobileFile(e.target.files ? e.target.files[0] : null)} />
            <div className="preview">
              {desktopFile && <img src={URL.createObjectURL(desktopFile)} alt="preview desktop" />}
              {mobileFile && <img src={URL.createObjectURL(mobileFile)} alt="preview mobile" />}
            </div>
            <button onClick={uploadHero}>آپلود تصاویر</button>

            {hero && (
              <div className="current-images">
                <img src={hero.desktop_image} alt="desktop" />
                <img src={hero.mobile_image} alt="mobile" />
              </div>
            )}
          </div>
        )}

        {/* ----- Collection Tab ----- */}
        {activeTab === "collection" && (
          <div className="admin-collection-tab">
            <h3>مدیریت کالکشن‌ها</h3>

            {/* فرم افزودن/ویرایش */}
            <div className="collection-form">
              <input placeholder="عنوان" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input type="file" accept="image/*" onChange={(e) => setDesktopFile(e.target.files ? e.target.files[0] : null)} />
              <input type="file" accept="image/*" onChange={(e) => setMobileFile(e.target.files ? e.target.files[0] : null)} />
              <button onClick={editingId ? saveEditCollection : addCollection}>
                {editingId ? "💾 ذخیره تغییرات" : "➕ افزودن کالکشن"}
              </button>
            </div>

            {collections.map((c) => (
              <div key={c.id} className="admin-collection-item">
                <span>{c.title}</span>
                <button onClick={() => editCollection(c)}>ویرایش</button>
                <button onClick={() => deleteCollection(c.id)}>حذف</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;