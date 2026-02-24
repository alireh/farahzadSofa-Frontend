// src/pages/AdminPage.tsx
import React, { useEffect, useState } from "react";
import Modal from "../component2/Modal";
import "../style2/adminPage.css";
import "../style2/admin-hero.css";
import "../style2/admin-collection.css";
import "../style2/AdminFaq.css";

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

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const AdminPage: React.FC = () => {
  const token = localStorage.getItem("token");

  // تب‌ها
  const [activeTab, setActiveTab] = useState<"menu" | "hero" | "collection" | "subCollection" | "bestSeller" | "faq">(
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

  // ===== SubCollection states =====
  const [selectedCollectionId, setSelectedCollectionId] = useState<number>(0);
  const [subCollections, setSubCollections] = useState<any[]>([]);
  const [subName, setSubName] = useState("");
  const [subPrice, setSubPrice] = useState<number>(0);
  const [subOldPrice, setSubOldPrice] = useState<number>(0);
  const [subImage, setSubImage] = useState<File | null>(null);
  const [editingSubId, setEditingSubId] = useState<number | null>(null);


  // ===== Best Seller states =====
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [bsTitle, setBsTitle] = useState("");
  const [bsPrice, setBsPrice] = useState<number>(0);
  const [bsRating, setBsRating] = useState<number>(0);
  const [bsImage, setBsImage] = useState<File | null>(null);
  const [editingBsId, setEditingBsId] = useState<number | null>(null);


  // ===== Faq states =====
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null);

  // ===== Protect admin =====
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchMenu();
    fetchHero();
    fetchCollections();
    fetchBestSellers();
    fetchFaqs();
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
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        }, body: formData
      });
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      await fetch(`/api/collections/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      setCollections(collections.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!selectedCollectionId) return;

    fetch(`/api/sub-collections/${selectedCollectionId}`)
      .then((r) => r.json())
      .then(setSubCollections)
      .catch(console.error);
  }, [selectedCollectionId]);

  const addSubCollection = async () => {
    if (!selectedCollectionId) return alert("کالکشن را انتخاب کن");

    const formData = new FormData();
    formData.append("collection_id", String(selectedCollectionId));
    formData.append("name", subName);
    formData.append("price", String(subPrice));
    formData.append("old_price", String(subOldPrice));
    if (subImage) formData.append("image", subImage);

    await fetch("/api/sub-collections", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    setSubName("");
    setSubPrice(0);
    setSubOldPrice(0);
    setSubImage(null);

    // reload
    fetch(`/api/sub-collections/${selectedCollectionId}`)
      .then((r) => r.json())
      .then(setSubCollections);
  };

  const editSubCollection = (item: any) => {
    setEditingSubId(item.id);
    setSubName(item.name);
    setSubPrice(item.price);
    setSubOldPrice(item.old_price || 0);
  };

  const saveEditSubCollection = async () => {
    if (!editingSubId) return;

    const formData = new FormData();
    formData.append("name", subName);
    formData.append("price", String(subPrice));
    formData.append("old_price", String(subOldPrice));
    if (subImage) formData.append("image", subImage);

    await fetch(`/api/sub-collections/${editingSubId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    setEditingSubId(null);
    setSubName("");

    fetch(`/api/sub-collections/${selectedCollectionId}`)
      .then((r) => r.json())
      .then(setSubCollections);
  };

  const deleteSubCollection = async (id: number) => {
    await fetch(`/api/sub-collections/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    setSubCollections((prev) => prev.filter((x) => x.id !== id));
  };


  // ===== BestSellers CRUD =====
  const fetchBestSellers = async () => {
    const res = await fetch("/api/best-sellers");
    const data = await res.json();
    setBestSellers(data);
  };
  const addBestSeller = async () => {
    const formData = new FormData();
    formData.append("title", bsTitle);
    formData.append("price", String(bsPrice));
    formData.append("rating", String(bsRating));
    if (bsImage) formData.append("image", bsImage);

    await fetch("/api/best-sellers", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setBsTitle("");
    setBsPrice(0);
    setBsRating(0);
    setBsImage(null);
    fetchBestSellers();
  };
  const editBestSeller = (item: any) => {
    setEditingBsId(item.id);
    setBsTitle(item.title);
    setBsPrice(item.price);
    setBsRating(item.rating);
  };
  const saveEditBestSeller = async () => {
    if (!editingBsId) return;

    const formData = new FormData();
    formData.append("title", bsTitle);
    formData.append("price", String(bsPrice));
    formData.append("rating", String(bsRating));
    if (bsImage) formData.append("image", bsImage);

    await fetch(`/api/best-sellers/${editingBsId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setEditingBsId(null);
    setBsTitle("");
    setBsPrice(0);
    setBsRating(0);
    setBsImage(null);
    fetchBestSellers();
  };

  const deleteBestSeller = async (id: number) => {
    await fetch(`/api/best-sellers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setBestSellers((prev) => prev.filter((x) => x.id !== id));
  };


  const fetchFaqs = () => {
    fetch("/api/common_questions")
      .then(r => r.json())
      .then(setFaqs);
  };


  const addFaq = async () => {
    const res = await fetch("/api/common_questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question: faqQuestion,
        answer: faqAnswer,
      }),
    });

    const newItem = await res.json();
    setFaqs(prev => [newItem, ...prev]);
    setFaqQuestion("");
    setFaqAnswer("");
  };


  const editFaq = (item: FaqItem) => {
    setEditingFaqId(item.id);
    setFaqQuestion(item.question);
    setFaqAnswer(item.answer);
  };


  const saveEditFaq = async () => {
    if (!editingFaqId) return;

    const res = await fetch(`/api/common_questions/${editingFaqId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question: faqQuestion,
        answer: faqAnswer,
      }),
    });

    const updated = await res.json();

    setFaqs(prev =>
      prev.map(x => (x.id === editingFaqId ? updated : x))
    );

    setEditingFaqId(null);
    setFaqQuestion("");
    setFaqAnswer("");
    fetchFaqs();
  };

  const deleteFaq = async (id: number) => {
    await fetch(`/api/common_questions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setFaqs(prev => prev.filter(x => x.id !== id));
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
          <li className={activeTab === "subCollection" ? "active" : ""} onClick={() => setActiveTab("subCollection")}>
            مدیریت زیرکالکشن‌ها
          </li>
          <li
            className={activeTab === "bestSeller" ? "active" : ""}
            onClick={() => setActiveTab("bestSeller")}
          >
            مدیریت محصولات پرفروش
          </li>
          <li
            className={activeTab === "faq" ? "active" : ""}
            onClick={() => setActiveTab("faq")}
          >
            مدیریت سوالات متداول
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

                <div className="collection-info">
                  <img
                    src={c.desktop_image}
                    alt={c.title}
                    className="collection-thumb"
                  />
                  <span>{c.title}</span>
                </div>

                <div className="collection-actions">
                  <button onClick={() => editCollection(c)}>ویرایش</button>
                  <button onClick={() => deleteCollection(c.id)}>حذف</button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ----- Collection Tab ----- */}
        {activeTab === "subCollection" && (
          <div className="admin-subcollection-box">
            <h3>مدیریت زیرکالکشن‌ها</h3>

            {/* انتخاب کالکشن */}
            <select
              value={selectedCollectionId}
              onChange={(e) => setSelectedCollectionId(Number(e.target.value))}
            >
              <option value={0}>انتخاب کالکشن</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            {/* فرم */}
            <div className="subcollection-form">
              <input
                placeholder="نام محصول"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
              />

              <input
                placeholder="قیمت"
                type="number"
                value={subPrice}
                onChange={(e) => setSubPrice(Number(e.target.value))}
              />

              <input
                placeholder="قیمت قبل"
                type="number"
                value={subOldPrice}
                onChange={(e) => setSubOldPrice(Number(e.target.value))}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSubImage(e.target.files ? e.target.files[0] : null)
                }
              />

              <button
                onClick={editingSubId ? saveEditSubCollection : addSubCollection}
              >
                {editingSubId ? "💾 ذخیره زیرکالکشن" : "➕ افزودن زیرکالکشن"}
              </button>
            </div>

            {/* لیست */}
            <div className="subcollection-list">
              {subCollections.map((s) => (
                <div key={s.id} className="subcollection-item">

                  <div className="subcollection-info">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="subcollection-thumb"
                    />

                    <div>
                      <div className="sub-name">{s.name}</div>
                      <div className="sub-price">
                        {s.price?.toLocaleString("fa-IR")} تومان
                      </div>
                    </div>
                  </div>

                  <div>
                    <button onClick={() => editSubCollection(s)}>ویرایش</button>
                    <button onClick={() => deleteSubCollection(s.id)}>حذف</button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}




        {/* ----- Collection Tab ----- */}
        {activeTab === "bestSeller" && (
          <div className="admin-bestseller-box">
            <h3>مدیریت محصولات پرفروش</h3>

            {/* فرم */}
            <div className="subcollection-form">
              <input
                placeholder="عنوان"
                value={bsTitle}
                onChange={(e) => setBsTitle(e.target.value)}
              />

              <input
                type="number"
                placeholder="قیمت"
                value={bsPrice}
                onChange={(e) => setBsPrice(Number(e.target.value))}
              />

              <input
                type="number"
                step="0.1"
                placeholder="امتیاز"
                value={bsRating}
                onChange={(e) => setBsRating(Number(e.target.value))}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setBsImage(e.target.files ? e.target.files[0] : null)
                }
              />

              <button
                onClick={editingBsId ? saveEditBestSeller : addBestSeller}
              >
                {editingBsId ? "💾 ذخیره" : "➕ افزودن"}
              </button>
            </div>

            {/* لیست */}
            <div className="subcollection-list">
              {bestSellers.map((s) => (
                <div key={s.id} className="subcollection-item">
                  <div className="subcollection-info">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="subcollection-thumb"
                    />

                    <div>
                      <div className="sub-name">{s.title}</div>
                      <div className="sub-price">
                        {s.price?.toLocaleString("fa-IR")} تومان
                      </div>
                      <div>⭐ {s.rating}</div>
                    </div>
                  </div>

                  <div>
                    <button onClick={() => editBestSeller(s)}>ویرایش</button>
                    <button onClick={() => deleteBestSeller(s.id)}>حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}




        {activeTab === "faq" && (
          <div className="admin-faq-box">
            <h3>مدیریت سوالات متداول</h3>

            <div className="faq-form">
              <input
                placeholder="سوال"
                value={faqQuestion}
                onChange={(e) => setFaqQuestion(e.target.value)}
              />

              <textarea
                placeholder="پاسخ"
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
              />

              <button onClick={editingFaqId ? saveEditFaq : addFaq}>
                {editingFaqId ? "💾 ذخیره" : "➕ افزودن"}
              </button>
            </div>

            <div className="faq-list">
              {faqs.map((f) => (
                <div key={f.id} className="faq-item">
                  <div>
                    <strong>{f.question}</strong>
                    <p>{f.answer}</p>
                  </div>

                  <div>
                    <button onClick={() => editFaq(f)}>ویرایش</button>
                    <button onClick={() => deleteFaq(f.id)}>حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;