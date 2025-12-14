
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SiteData, Image } from '../types';

const AdminPage: React.FC = () => {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageTitle, setImageTitle] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [addressText, setAddressText] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/data');
      setData(response.data);
      setAboutText(response.data.about);
      setAddressText(response.data.address);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('لطفا یک فایل انتخاب کنید');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    if (imageTitle) formData.append('title', imageTitle);

    try {
      await axios.post('http://localhost:5000/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('تصویر با موفقیت آپلود شد');
      setSelectedFile(null);
      setImageTitle('');
      fetchAdminData();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('خطا در آپلود تصویر');
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (window.confirm('آیا از حذف این تصویر مطمئنید؟')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/image/${id}`);
        alert('تصویر حذف شد');
        fetchAdminData();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleUpdateContent = async () => {
    try {
      await axios.put('http://localhost:5000/api/admin/update-content', {
        about: aboutText,
        address: addressText
      });
      alert('اطلاعات با موفقیت به‌روزرسانی شد');
      fetchAdminData();
    } catch (error) {
      console.error('Error updating content:', error);
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
        {/* بخش آپلود تصویر */}
        <section style={styles.section}>
          <h2>آپلود تصویر جدید</h2>
          <div style={styles.uploadForm}>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            <input
              type="text"
              placeholder="عنوان تصویر"
              value={imageTitle}
              onChange={(e) => setImageTitle(e.target.value)}
              style={styles.textInput}
            />
            <button 
              onClick={handleUpload}
              style={styles.uploadButton}
            >
              آپلود تصویر
            </button>
          </div>
        </section>

        {/* بخش مدیریت تصاویر */}
        <section style={styles.section}>
          <h2>تصاویر موجود</h2>
          <div style={styles.imageList}>
            {data.images.map((image) => (
              <div key={image.id} style={styles.imageItem}>
                <img 
                  src={`http://localhost:5000${image.url}`} 
                  alt={image.title}
                  style={styles.adminImage}
                />
                <p>{image.title}</p>
                <button 
                  onClick={() => handleDeleteImage(image.id)}
                  style={styles.deleteButton}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* بخش ویرایش محتوا */}
        <section style={styles.section}>
          <h2>ویرایش محتوا</h2>
          <div style={styles.contentForm}>
            <div style={styles.formGroup}>
              <label>درباره ما:</label>
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                style={styles.textarea}
                rows={4}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>آدرس:</label>
              <input
                type="text"
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                style={styles.textInput}
              />
            </div>
            
            <button 
              onClick={handleUpdateContent}
              style={styles.updateButton}
            >
              ذخیره تغییرات
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    direction: 'rtl' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    borderBottom: '2px solid #eee',
    paddingBottom: '20px',
  },
  backLink: {
    color: '#007bff',
    textDecoration: 'none',
    padding: '8px 16px',
    border: '1px solid #007bff',
    borderRadius: '4px',
  },
  sectionsContainer: {
    display: 'grid',
    gap: '30px',
  },
  section: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  uploadForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    maxWidth: '400px',
  },
  fileInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  textInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  uploadButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  imageList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  imageItem: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    textAlign: 'center' as const,
    backgroundColor: 'white',
  },
  adminImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover' as const,
    borderRadius: '4px',
    marginBottom: '10px',
  },
  deleteButton: {
    padding: '5px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginTop: '10px',
  },
  contentForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    maxWidth: '600px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
  },
  updateButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    alignSelf: 'flex-start',
  },
};

export default AdminPage;