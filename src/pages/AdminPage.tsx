import React, { useState, useEffect } from "react";
import api from "../api"; // instance با token خودکار
import { SiteData } from "../types";
import Dropdown from "../components/dropdown";

const AdminPage: React.FC = () => {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageTitle, setImageTitle] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [addressText, setAddressText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [phoneText, setPhoneText] = useState("");
  const [imgType, setImgType] = useState(0);

  const categories = ["تصاویر دسته بندی", "تصویر اصلی سایت"];

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await api.get("/admin/data");
      setData(response.data);
      setAboutText(response.data.about);
      setAddressText(response.data.address);
      setEmailText(response.data.email);
      setPhoneText(response.data.phone);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      alert("لطفا ابتدا وارد شوید");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("لطفا یک فایل انتخاب کنید");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("type", imgType.toString());
    if (imageTitle) formData.append("title", imageTitle);

    try {
      await api.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("تصویر با موفقیت آپلود شد");
      setSelectedFile(null);
      setImageTitle("");
      fetchAdminData();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("خطا در آپلود تصویر");
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (!window.confirm("آیا از حذف این تصویر مطمئنید؟")) return;

    try {
      await api.delete(`/admin/image/${id}`);
      alert("تصویر حذف شد");
      fetchAdminData();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("خطا در حذف تصویر");
    }
  };

  const handleUpdateContent = async () => {
    try {
      await api.put("/admin/update-content", {
        about: aboutText,
        address: addressText,
        email: emailText,
        phone: phoneText,
      });
      alert("اطلاعات با موفقیت به‌روزرسانی شد");
      fetchAdminData();
    } catch (error) {
      console.error("Error updating content:", error);
      alert("خطا در به‌روزرسانی محتوا");
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;
  if (!data) return <div>خطا در دریافت اطلاعات</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>پنل مدیریت</h1>
        <a href="/" style={styles.backLink}>بازگشت به سایت</a>
      </header>

      <div style={styles.sectionsContainer}>
        {/* آپلود تصویر */}
        <section style={styles.section}>
          <h2>آپلود تصویر جدید</h2>
          <div style={styles.uploadForm}>
            <input type="file" accept="image/*" onChange={handleFileChange} style={styles.fileInput} />
            <input type="text" placeholder="عنوان تصویر" value={imageTitle} onChange={(e) => setImageTitle(e.target.value)} style={styles.textInput} />
            <Dropdown
              title="نوع تصویر"
              items={categories}
              onSelect={(item, index) => setImgType(index)}
              defaultIndex={0}
              width="300px"
            />
            <button onClick={handleUpload} style={styles.uploadButton}>آپلود تصویر</button>
          </div>
        </section>

        {/* مدیریت تصاویر */}
        <section style={styles.section}>
          <h2>تصاویر موجود</h2>
          <div style={styles.imageList}>
            {data.images.map((img) => (
              <div key={img.id} style={styles.imageItem}>
                <img src={`http://localhost:5000${img.url}`} alt={img.title} style={styles.adminImage} />
                <p>{img.title}</p>
                <button onClick={() => handleDeleteImage(img.id)} style={styles.deleteButton}>حذف</button>
              </div>
            ))}
          </div>
        </section>

        {/* ویرایش محتوا */}
        <section style={styles.section}>
          <h2>ویرایش محتوا</h2>
          <div style={styles.contentForm}>
            <div style={styles.formGroup}>
              <label>درباره ما:</label>
              <textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} style={styles.textarea} rows={4} />
            </div>
            <div style={styles.formGroup}>
              <label>آدرس:</label>
              <input type="text" value={addressText} onChange={(e) => setAddressText(e.target.value)} style={styles.textInput} />
            </div>
            <div style={styles.formGroup}>
              <label>ایمیل:</label>
              <input type="text" value={emailText} onChange={(e) => setEmailText(e.target.value)} style={styles.textInput} />
            </div>
            <div style={styles.formGroup}>
              <label>تلفن:</label>
              <input type="text" value={phoneText} onChange={(e) => setPhoneText(e.target.value)} style={styles.textInput} />
            </div>
            <button onClick={handleUpdateContent} style={styles.updateButton}>ذخیره تغییرات</button>
          </div>
        </section>
      </div>
    </div>
  );
};


const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    direction: "rtl" as const,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    borderBottom: "2px solid #eee",
    paddingBottom: "20px",
  },
  backLink: {
    color: "#007bff",
    textDecoration: "none",
    padding: "8px 16px",
    border: "1px solid #007bff",
    borderRadius: "4px",
  },
  sectionsContainer: {
    display: "grid",
    gap: "30px",
  },
  section: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  uploadForm: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    maxWidth: "400px",
  },
  fileInput: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  textInput: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  },
  uploadButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  imageList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  imageItem: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    textAlign: "center" as const,
    backgroundColor: "white",
  },
  adminImage: {
    width: "100%",
    height: "150px",
    objectFit: "cover" as const,
    borderRadius: "4px",
    marginBottom: "10px",
  },
  deleteButton: {
    padding: "5px 15px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    marginTop: "10px",
  },
  contentForm: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    maxWidth: "600px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "5px",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
  },
  updateButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    alignSelf: "flex-start",
  },
};

export default AdminPage;
