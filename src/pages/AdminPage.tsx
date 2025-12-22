import React, { useState, useEffect } from "react";
import api from "../api"; // instance با token خودکار
import { Image, SiteData, SocialLink, Product, Category } from "../types";
import Dropdown from "../components/dropdown";
import { Navigate } from "react-router-dom";
import SocialLinksManager from "../components/SocialLinksManager";
import AdminSocialLinks from "../components/SocialLinksManager";

const AdminPage: React.FC = () => {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  // برای بخش تصاویر
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageTitle, setImageTitle] = useState("");
  const [imgType, setImgType] = useState(0);

  // برای بخش محتوا
  const [aboutText, setAboutText] = useState("");
  const [addressText, setAddressText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [phoneText, setPhoneText] = useState("");

  // برای بخش مقالات
  const [articles, setArticles] = useState<any[]>([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<number | null>(null);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleImage, setArticleImage] = useState<File | null>(null);
  const [removeArticleImage, setRemoveArticleImage] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

  // const categories = ["تصاویر دسته بندی", "تصویر اصلی سایت"];

  // اضافه کردن state‌های جدید
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [removeCategoryImage, setRemoveCategoryImage] = useState(false);

  // state محصولات
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDiscount, setProductDiscount] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productFeatures, setProductFeatures] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [removeProductImage, setRemoveProductImage] = useState(false);

  // state تنظیمات
  const [showCarousel, setShowCarousel] = useState(true);
  const [maxCarouselItems, setMaxCarouselItems] = useState(5);
  const [articleDisplayMode, setArticleDisplayMode] = useState("card");
  const [carouselImages, setCarouselImages] = useState<Image[]>([]);
  const [carouselImageFile, setCarouselImageFile] = useState<File | null>(null);
  const [carouselImageTitle, setCarouselImageTitle] = useState("");

  // state شبکه‌های اجتماعی
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [editingSocialLink, setEditingSocialLink] = useState<number | null>(null);
  const [socialLinkUrl, setSocialLinkUrl] = useState("");

  const [activeTab, setActiveTab] = useState<'categories' | 'products' | 'carousel' | 'articles' | 'social'>('categories');

  useEffect(() => {


    fetchAdminData();
    fetchArticles();
    fetchCategories();
    fetchProducts();
    fetchSettings();
    fetchSocialLinks();

  }, []);


  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/admin/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  const fetchSettings = async () => {
    try {
      const response = await api.get("/site-settings");
      setShowCarousel(response.data.show_carousel);
      setMaxCarouselItems(response.data.max_carousel_items);
      setArticleDisplayMode(response.data.article_display_mode);
      setCarouselImages(response.data.carouselImages || []);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const response = await api.get("http://localhost:5000/api/admin/social-links");
      setSocialLinks(response.data);
    } catch (error) {
      console.error("Error fetching social links:", error);
    }
  };

  // توابع مدیریت دسته‌بندی‌ها
  const handleCreateCategory = async () => {
    if (!categoryTitle.trim()) {
      alert("عنوان دسته‌بندی الزامی است");
      return;
    }

    const formData = new FormData();
    formData.append("title", categoryTitle);
    formData.append("description", categoryDescription);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    try {
      await api.post("/admin/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("دسته‌بندی با موفقیت ایجاد شد");
      resetCategoryForm();
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      alert("خطا در ایجاد دسته‌بندی");
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !categoryTitle.trim()) {
      alert("عنوان دسته‌بندی الزامی است");
      return;
    }

    const formData = new FormData();
    formData.append("title", categoryTitle);
    formData.append("description", categoryDescription);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }
    if (removeCategoryImage) {
      formData.append("removeImage", "true");
    }

    try {
      await api.put(`/admin/categories/${editingCategory}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("دسته‌بندی با موفقیت ویرایش شد");
      resetCategoryForm();
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("خطا در ویرایش دسته‌بندی");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("آیا از حذف این دسته‌بندی مطمئنید؟")) return;

    try {
      await api.delete(`/admin/categories/${id}`);
      alert("دسته‌بندی حذف شد");
      fetchCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      alert(error.response?.data?.error || "خطا در حذف دسته‌بندی");
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category.id);
    setCategoryTitle(category.title);
    setCategoryDescription(category.description || "");
    setCategoryImage(null);
    setRemoveCategoryImage(false);
    setShowCategoryForm(true);
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryTitle("");
    setCategoryDescription("");
    setCategoryImage(null);
    setRemoveCategoryImage(false);
    setShowCategoryForm(false);
  };

  // توابع مدیریت محصولات
  const handleCreateProduct = async () => {
    if (!selectedCategoryId || !productTitle.trim() || !productPrice || !productImage) {
      alert("دسته‌بندی، عنوان، قیمت و تصویر الزامی هستند");
      return;
    }

    const formData = new FormData();
    formData.append("category_id", selectedCategoryId.toString());
    formData.append("title", productTitle);
    formData.append("price", productPrice);
    formData.append("discount_percent", productDiscount || "0");
    formData.append("description", productDescription);
    formData.append("features", productFeatures);
    formData.append("image", productImage);

    try {
      await api.post("/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("محصول با موفقیت ایجاد شد");
      resetProductForm();
      fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
      alert("خطا در ایجاد محصول");
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !productTitle.trim() || !productPrice) {
      alert("عنوان و قیمت محصول الزامی هستند");
      return;
    }

    const formData = new FormData();
    formData.append("title", productTitle);
    formData.append("price", productPrice);
    formData.append("discount_percent", productDiscount || "0");
    formData.append("description", productDescription);
    formData.append("features", productFeatures);
    if (productImage) {
      formData.append("image", productImage);
    }

    try {
      await api.put(`/admin/products/${editingProduct}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("محصول با موفقیت ویرایش شد");
      resetProductForm();
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("خطا در ویرایش محصول");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("آیا از حذف این محصول مطمئنید؟")) return;

    try {
      await api.delete(`/admin/products/${id}`);
      alert("محصول حذف شد");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("خطا در حذف محصول");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product.id);
    setSelectedCategoryId(product.category_id);
    setProductTitle(product.title);
    setProductPrice(product.price.toString());
    setProductDiscount(product.discount_percent.toString());
    setProductDescription(product.description || "");
    setProductFeatures(product.features || "");
    setProductImage(null);
    setRemoveProductImage(false);
    setShowProductForm(true);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setSelectedCategoryId(null);
    setProductTitle("");
    setProductPrice("");
    setProductDiscount("");
    setProductDescription("");
    setProductFeatures("");
    setProductImage(null);
    setRemoveProductImage(false);
    setShowProductForm(false);
  };

  // توابع مدیریت Carousel
  const handleUploadCarouselImage = async () => {
    if (!carouselImageFile) {
      alert("لطفا یک تصویر انتخاب کنید");
      return;
    }

    const formData = new FormData();
    formData.append("image", carouselImageFile);
    if (carouselImageTitle) {
      formData.append("title", carouselImageTitle);
    }

    try {
      await api.post("/admin/carousel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("تصویر Carousel با موفقیت آپلود شد");
      setCarouselImageFile(null);
      setCarouselImageTitle("");
      fetchSettings();
    } catch (error: any) {
      console.error("Error uploading carousel image:", error);
      alert(error.response?.data?.error || "خطا در آپلود تصویر");
    }
  };

  const handleDeleteCarouselImage = async (id: number) => {
    if (!window.confirm("آیا از حذف این تصویر Carousel مطمئنید؟")) return;

    try {
      await api.delete(`/admin/carousel/${id}`);
      alert("تصویر Carousel حذف شد");
      fetchSettings();
    } catch (error) {
      console.error("Error deleting carousel image:", error);
      alert("خطا در حذف تصویر");
    }
  };

  // توابع مدیریت تنظیمات
  const handleUpdateSettings = async () => {
    try {
      await api.put("/admin/site-settings", {
        show_carousel: showCarousel,
        max_carousel_items: maxCarouselItems,
        article_display_mode: articleDisplayMode,
      });
      alert("تنظیمات با موفقیت به‌روزرسانی شد");
      fetchSettings();
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("خطا در به‌روزرسانی تنظیمات");
    }
  };

  // توابع مدیریت شبکه‌های اجتماعی
  const handleUpdateSocialLink = async (id: number) => {
    if (!socialLinkUrl.trim()) {
      alert("آدرس URL الزامی است");
      return;
    }

    try {
      await api.put(`/admin/social-links/${id}`, {
        url: socialLinkUrl,
      });
      alert("لینک شبکه اجتماعی با موفقیت به‌روزرسانی شد");
      setEditingSocialLink(null);
      setSocialLinkUrl("");
      fetchSocialLinks();
    } catch (error) {
      console.error("Error updating social link:", error);
      alert("خطا در به‌روزرسانی لینک");
    }
  };

  const handleToggleSocialLink = async (id: number, currentStatus: boolean) => {
    try {
      await api.put(`/admin/social-links/${id}`, {
        is_active: !currentStatus,
      });
      fetchSocialLinks();
    } catch (error) {
      console.error("Error toggling social link:", error);
    }
  };


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

  const fetchArticles = async () => {
    try {
      const response = await api.get("/admin/articles");
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleArticleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArticleImage(e.target.files[0]);
      setRemoveArticleImage(false);
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

  // ========== توابع مدیریت مقالات ==========
  const handleCreateArticle = async () => {
    if (!articleTitle.trim() || !articleContent.trim()) {
      alert("عنوان و محتویات مقاله الزامی است");
      return;
    }

    const formData = new FormData();
    formData.append("title", articleTitle);
    formData.append("content", articleContent);
    if (articleImage) {
      formData.append("image", articleImage);
    }

    try {
      await api.post("/admin/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("مقاله با موفقیت ایجاد شد");
      resetArticleForm();
      fetchArticles();
    } catch (error) {
      console.error("Error creating article:", error);
      alert("خطا در ایجاد مقاله");
    }
  };

  const handleUpdateArticle = async () => {
    if (!editingArticle || !articleTitle.trim() || !articleContent.trim()) {
      alert("عنوان و محتویات مقاله الزامی است");
      return;
    }

    const formData = new FormData();
    formData.append("title", articleTitle);
    formData.append("content", articleContent);
    if (articleImage) {
      formData.append("image", articleImage);
    }
    if (removeArticleImage) {
      formData.append("removeImage", "true");
    }

    try {
      await api.put(`/admin/articles/${editingArticle}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("مقاله با موفقیت ویرایش شد");
      resetArticleForm();
      fetchArticles();
    } catch (error) {
      console.error("Error updating article:", error);
      alert("خطا در ویرایش مقاله");
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!window.confirm("آیا از حذف این مقاله مطمئنید؟")) return;

    try {
      await api.delete(`/admin/article/${id}`);
      alert("مقاله حذف شد");
      fetchArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("خطا در حذف مقاله");
    }
  };

  const handleEditArticle = (article: any) => {
    setEditingArticle(article.id);
    setArticleTitle(article.title);
    setArticleContent(article.content);
    setArticleImage(null);
    setRemoveArticleImage(false);
    setShowArticleForm(true);
  };

  const resetArticleForm = () => {
    setEditingArticle(null);
    setArticleTitle("");
    setArticleContent("");
    setArticleImage(null);
    setRemoveArticleImage(false);
    setShowArticleForm(false);
  };

  if (loading) return <div>در حال بارگذاری...</div>;
  if (!data) {
    return <Navigate to="/login" replace />;
    // return <div>خطا در دریافت اطلاعات</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>پنل مدیریت</h1>
        <a href="/" style={styles.backLink}>بازگشت به سایت</a>
      </header>

      <div style={styles.sectionsContainer}>
        {/* مدیریت مقالات */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2>مدیریت مقالات</h2>
            <button
              onClick={() => {
                resetArticleForm();
                setShowArticleForm(!showArticleForm);
              }}
              style={styles.toggleButton}
            >
              {showArticleForm ? "بستن فرم" : "ایجاد مقاله جدید"}
            </button>
          </div>

          {showArticleForm && (
            <div style={styles.articleForm}>
              <input
                type="text"
                placeholder="عنوان مقاله"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                style={styles.textInput}
              />
              <textarea
                placeholder="محتوا مقاله"
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                style={styles.textarea}
                rows={6}
              />

              <div style={styles.imageUploadSection}>
                <label style={styles.uploadLabel}>
                  انتخاب تصویر مقاله:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleArticleImageChange}
                    style={styles.fileInput}
                  />
                  {articleImage && (
                    <span style={styles.fileName}>{articleImage.name}</span>
                  )}
                </label>

                {editingArticle && articles.find(a => a.id === editingArticle)?.image_url && !removeArticleImage && (
                  <div style={styles.currentImage}>
                    <p>تصویر فعلی:</p>
                    <img
                      src={`http://localhost:5000${articles.find(a => a.id === editingArticle)?.image_url}`}
                      alt="Current"
                      style={styles.currentImagePreview}
                    />
                    <button
                      onClick={() => setRemoveArticleImage(true)}
                      style={styles.removeImageButton}
                    >
                      حذف تصویر فعلی
                    </button>
                  </div>
                )}

                {removeArticleImage && (
                  <div style={styles.removedMessage}>
                    <span style={{ color: "#dc3545" }}>تصویر فعلی حذف خواهد شد</span>
                    <button
                      onClick={() => setRemoveArticleImage(false)}
                      style={styles.cancelRemoveButton}
                    >
                      لغو
                    </button>
                  </div>
                )}
              </div>

              <div style={styles.formActions}>
                {editingArticle ? (
                  <>
                    <button onClick={handleUpdateArticle} style={styles.saveButton}>
                      ذخیره تغییرات
                    </button>
                    <button onClick={resetArticleForm} style={styles.cancelButton}>
                      لغو ویرایش
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleCreateArticle} style={styles.createButton}>
                      ایجاد مقاله
                    </button>
                    <button onClick={resetArticleForm} style={styles.cancelButton}>
                      انصراف
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* لیست مقالات */}
          <div style={styles.articlesList}>
            <h3>مقالات موجود ({articles.length})</h3>
            {articles.length === 0 ? (
              <p style={styles.noData}>هیچ مقاله‌ای وجود ندارد</p>
            ) : (
              articles.map((article) => (
                <div key={article.id} style={styles.articleItem}>
                  <div style={styles.articleInfo}>
                    <h4 style={styles.articleTitle}>{article.title}</h4>
                    <p style={styles.articleDate}>
                      {new Date(article.created_at).toLocaleDateString('fa-IR')}
                    </p>
                    {article.image_url && (
                      <img
                        src={`http://localhost:5000${article.image_url}`}
                        alt={article.title}
                        style={styles.articleThumbnail}
                      />
                    )}
                  </div>
                  <div style={styles.articleActions}>
                    <button
                      onClick={() => handleEditArticle(article)}
                      style={styles.editButton}
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      style={styles.deleteButton}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* آپلود تصویر */}
        <section style={styles.section}>
          <h2>آپلود تصویر جدید</h2>
          <div style={styles.uploadForm}>
            <input type="file" accept="image/*" onChange={handleFileChange} style={styles.fileInput} />
            <input type="text" placeholder="عنوان تصویر" value={imageTitle} onChange={(e) => setImageTitle(e.target.value)} style={styles.textInput} />
            {/* <Dropdown
              title="نوع تصویر"
              items={categories}
              onSelect={(item, index) => setImgType(index)}
              defaultIndex={0}
              width="300px"
            /> */}
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



      <div style={styles.sectionsContainer}>
        {/* مدیریت Carousel و تنظیمات */}
        <section style={styles.section}>
          <h2>تنظیمات Carousel</h2>
          <div style={styles.settingsForm}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showCarousel}
                onChange={(e) => setShowCarousel(e.target.checked)}
              />
              نمایش Carousel
            </label>

            <div style={styles.formGroup}>
              <label>حداکثر تعداد تصاویر Carousel:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={maxCarouselItems}
                onChange={(e) => setMaxCarouselItems(parseInt(e.target.value))}
                style={styles.numberInput}
              />
            </div>

            <div style={styles.formGroup}>
              <label>حالت نمایش مقالات:</label>
              <select
                value={articleDisplayMode}
                onChange={(e) => setArticleDisplayMode(e.target.value)}
                style={styles.selectInput}
              >
                <option value="card">کارت ساده</option>
                <option value="separate">صفحه جدا</option>
              </select>
            </div>

            <button onClick={handleUpdateSettings} style={styles.updateButton}>
              ذخیره تنظیمات
            </button>
          </div>

          {/* آپلود تصویر Carousel */}
          {showCarousel && (
            <div style={styles.carouselUpload}>
              <h3>آپلود تصویر Carousel</h3>
              <div style={styles.uploadForm}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCarouselImageFile(e.target.files?.[0] || null)}
                  style={styles.fileInput}
                />
                <input
                  type="text"
                  placeholder="عنوان تصویر"
                  value={carouselImageTitle}
                  onChange={(e) => setCarouselImageTitle(e.target.value)}
                  style={styles.textInput}
                />
                <button
                  onClick={handleUploadCarouselImage}
                  style={styles.uploadButton}
                  disabled={carouselImages.length >= maxCarouselItems}
                >
                  {carouselImages.length >= maxCarouselItems
                    ? `حداکثر ${maxCarouselItems} تصویر مجاز است`
                    : 'آپلود تصویر Carousel'}
                </button>
              </div>

              {/* لیست تصاویر Carousel */}
              <div style={styles.carouselList}>
                <h4>تصاویر Carousel ({carouselImages.length}/{maxCarouselItems})</h4>
                {carouselImages.length === 0 ? (
                  <p style={styles.noData}>هیچ تصویری برای Carousel وجود ندارد</p>
                ) : (
                  <div style={styles.imageGrid}>
                    {carouselImages.map((img) => (
                      <div key={img.id} style={styles.carouselImageItem}>
                        <img
                          src={`http://localhost:5000${img.url}`}
                          alt={img.title}
                          style={styles.carouselImage}
                        />
                        <p>{img.title}</p>
                        <button
                          onClick={() => handleDeleteCarouselImage(img.id)}
                          style={styles.deleteButton}
                        >
                          حذف
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* مدیریت دسته‌بندی‌ها */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2>مدیریت دسته‌بندی‌ها</h2>
            <button
              onClick={() => {
                resetCategoryForm();
                setShowCategoryForm(!showCategoryForm);
              }}
              style={styles.toggleButton}
            >
              {showCategoryForm ? "بستن فرم" : "ایجاد دسته‌بندی جدید"}
            </button>
          </div>

          {showCategoryForm && (
            <div style={styles.form}>
              <input
                type="text"
                placeholder="عنوان دسته‌بندی"
                value={categoryTitle}
                onChange={(e) => setCategoryTitle(e.target.value)}
                style={styles.textInput}
                required
              />

              <textarea
                placeholder="توضیحات دسته‌بندی"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                style={styles.textarea}
                rows={3}
              />

              <div style={styles.imageUploadSection}>
                <label style={styles.uploadLabel}>
                  انتخاب تصویر دسته‌بندی:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
                    style={styles.fileInput}
                  />
                  {categoryImage && (
                    <span style={styles.fileName}>{categoryImage.name}</span>
                  )}
                </label>

                {editingCategory && categories.find(c => c.id === editingCategory)?.image_url && !removeCategoryImage && (
                  <div style={styles.currentImage}>
                    <p>تصویر فعلی:</p>
                    <img
                      src={`http://localhost:5000${categories.find(c => c.id === editingCategory)?.image_url}`}
                      alt="Current"
                      style={styles.currentImagePreview}
                    />
                    <button
                      onClick={() => setRemoveCategoryImage(true)}
                      style={styles.removeImageButton}
                    >
                      حذف تصویر فعلی
                    </button>
                  </div>
                )}
              </div>

              <div style={styles.formActions}>
                {editingCategory ? (
                  <>
                    <button onClick={handleUpdateCategory} style={styles.saveButton}>
                      ذخیره تغییرات
                    </button>
                    <button onClick={resetCategoryForm} style={styles.cancelButton}>
                      لغو ویرایش
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleCreateCategory} style={styles.createButton}>
                      ایجاد دسته‌بندی
                    </button>
                    <button onClick={resetCategoryForm} style={styles.cancelButton}>
                      انصراف
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* لیست دسته‌بندی‌ها */}
          <div style={styles.categoriesList}>
            <h3>دسته‌بندی‌های موجود ({categories.length})</h3>
            {categories.length === 0 ? (
              <p style={styles.noData}>هیچ دسته‌بندی وجود ندارد</p>
            ) : (
              <div style={styles.categoriesGrid}>
                {categories.map((category) => (
                  <div key={category.id} style={styles.categoryItem}>
                    {category.image_url && (
                      <img
                        src={`http://localhost:5000${category.image_url}`}
                        alt={category.title}
                        style={styles.categoryImage}
                      />
                    )}
                    <div style={styles.categoryInfo}>
                      <h4 style={styles.categoryTitle}>{category.title}</h4>
                      {category.description && (
                        <p style={styles.categoryDescription}>{category.description}</p>
                      )}
                      <p style={styles.categoryMeta}>
                        تعداد محصولات: {category.product_count || 0}
                      </p>
                    </div>
                    <div style={styles.categoryActions}>
                      <button
                        onClick={() => handleEditCategory(category)}
                        style={styles.editButton}
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        style={styles.deleteButton}
                        disabled={(category.product_count || 0) > 0}
                        title={(category.product_count || 0) > 0 ? "ابتدا محصولات این دسته را حذف کنید" : ""}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* مدیریت محصولات */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2>مدیریت محصولات</h2>
            <button
              onClick={() => {
                resetProductForm();
                setShowProductForm(!showProductForm);
              }}
              style={styles.toggleButton}
            >
              {showProductForm ? "بستن فرم" : "ایجاد محصول جدید"}
            </button>
          </div>

          {showProductForm && (
            <div style={styles.form}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label>دسته‌بندی:</label>
                  <select
                    value={selectedCategoryId || ""}
                    onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
                    style={styles.selectInput}
                    required
                  >
                    <option value="">انتخاب دسته‌بندی</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label>عنوان محصول:</label>
                  <input
                    type="text"
                    placeholder="عنوان محصول"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    style={styles.textInput}
                    required
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label>قیمت (تومان):</label>
                  <input
                    type="number"
                    placeholder="قیمت"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    style={styles.textInput}
                    required
                    min="0"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>درصد تخفیف:</label>
                  <input
                    type="number"
                    placeholder="درصد تخفیف"
                    value={productDiscount}
                    onChange={(e) => setProductDiscount(e.target.value)}
                    style={styles.textInput}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label>توضیحات محصول:</label>
                <textarea
                  placeholder="توضیحات محصول"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  style={styles.textarea}
                  rows={3}
                />
              </div>

              <div style={styles.formGroup}>
                <label>ویژگی‌ها (هر ویژگی در یک خط):</label>
                <textarea
                  placeholder="ویژگی 1\nویژگی 2\n..."
                  value={productFeatures}
                  onChange={(e) => setProductFeatures(e.target.value)}
                  style={styles.textarea}
                  rows={3}
                />
              </div>

              <div style={styles.imageUploadSection}>
                <label style={styles.uploadLabel}>
                  انتخاب تصویر محصول:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProductImage(e.target.files?.[0] || null)}
                    style={styles.fileInput}
                    required={!editingProduct}
                  />
                  {productImage && (
                    <span style={styles.fileName}>{productImage.name}</span>
                  )}
                </label>

                {editingProduct && products.find(p => p.id === editingProduct)?.image_url && !removeProductImage && (
                  <div style={styles.currentImage}>
                    <p>تصویر فعلی:</p>
                    <img
                      src={`http://localhost:5000${products.find(p => p.id === editingProduct)?.image_url}`}
                      alt="Current"
                      style={styles.currentImagePreview}
                    />
                  </div>
                )}
              </div>

              <div style={styles.formActions}>
                {editingProduct ? (
                  <>
                    <button onClick={handleUpdateProduct} style={styles.saveButton}>
                      ذخیره تغییرات
                    </button>
                    <button onClick={resetProductForm} style={styles.cancelButton}>
                      لغو ویرایش
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleCreateProduct} style={styles.createButton}>
                      ایجاد محصول
                    </button>
                    <button onClick={resetProductForm} style={styles.cancelButton}>
                      انصراف
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* لیست محصولات */}
          <div style={styles.productsList}>
            <h3>محصولات ({products.length})</h3>
            {products.length === 0 ? (
              <p style={styles.noData}>هیچ محصولی وجود ندارد</p>
            ) : (
              <div style={styles.productsGrid}>
                {products.map((product) => {
                  const category = categories.find(c => c.id === product.category_id);
                  return (
                    <div key={product.id} style={styles.productItem}>
                      <img
                        src={`http://localhost:5000${product.image_url}`}
                        alt={product.title}
                        style={styles.productImage}
                      />
                      <div style={styles.productInfo}>
                        <h4 style={styles.productTitle}>{product.title}</h4>
                        <p style={styles.productCategory}>
                          دسته: {category?.title || 'نامشخص'}
                        </p>
                        <div style={styles.productPrice}>
                          <span style={styles.price}>
                            {product.price.toLocaleString()} تومان
                          </span>
                          {product.discount_percent > 0 && (
                            <span style={styles.discount}>
                              {product.discount_percent}% تخفیف
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={styles.productActions}>
                        <button
                          onClick={() => handleEditProduct(product)}
                          style={styles.editButton}
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          style={styles.deleteButton}
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* مدیریت شبکه‌های اجتماعی */}
        <section style={styles.section}>
          <h2>مدیریت شبکه‌های اجتماعی</h2>
          {/* <div style={styles.socialLinksList}>
            {socialLinks.map((link) => (
              <div key={link.id} style={styles.socialLinkItem}>
                <div style={styles.socialLinkInfo}>
                  <span style={styles.socialPlatform}>{link.platform}</span>
                  <span style={styles.socialUrl}>{link.url}</span>
                </div>
                <div style={styles.socialLinkActions}>
                  <button
                    onClick={() => handleToggleSocialLink(link.id, link.is_active)}
                    style={link.is_active ? styles.activeButton : styles.inactiveButton}
                  >
                    {link.is_active ? 'فعال' : 'غیرفعال'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingSocialLink(link.id);
                      setSocialLinkUrl(link.url);
                    }}
                    style={styles.editButton}
                  >
                    ویرایش URL
                  </button>
                </div>

                {editingSocialLink === link.id && (
                  <div style={styles.socialLinkEdit}>
                    <input
                      type="text"
                      value={socialLinkUrl}
                      onChange={(e) => setSocialLinkUrl(e.target.value)}
                      placeholder="آدرس URL جدید"
                      style={styles.textInput}
                    />
                    <button
                      onClick={() => handleUpdateSocialLink(link.id)}
                      style={styles.saveButton}
                    >
                      ذخیره
                    </button>
                    <button
                      onClick={() => {
                        setEditingSocialLink(null);
                        setSocialLinkUrl("");
                      }}
                      style={styles.cancelButton}
                    >
                      لغو
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div> */}
          <AdminSocialLinks />
        </section>

        {/* بقیه بخش‌ها (مقالات، آپلود تصویر، ویرایش محتوا) */}
        {/* ... کدهای قبلی بدون تغییر ... */}
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
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  toggleButton: {
    padding: "8px 16px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  // استایل‌های فرم مقاله
  articleForm: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
    marginBottom: "30px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "white",
  },
  imageUploadSection: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    padding: "15px",
    border: "1px dashed #ccc",
    borderRadius: "4px",
  },
  uploadLabel: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    cursor: "pointer",
  },
  fileName: {
    color: "#28a745",
    fontSize: "14px",
    marginTop: "5px",
  },
  currentImage: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
  },
  currentImagePreview: {
    width: "150px",
    height: "100px",
    objectFit: "cover" as const,
    borderRadius: "4px",
  },
  removeImageButton: {
    padding: "5px 10px",
    backgroundColor: "#ffc107",
    color: "#212529",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  removedMessage: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    backgroundColor: "#f8d7da",
    borderRadius: "4px",
  },
  cancelRemoveButton: {
    padding: "3px 8px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "11px",
  },
  formActions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  createButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  // استایل‌های لیست مقالات
  articlesList: {
    marginTop: "30px",
  },
  articleItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "white",
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    margin: "0 0 5px 0",
    fontSize: "16px",
  },
  articleDate: {
    margin: "0 0 10px 0",
    fontSize: "12px",
    color: "#6c757d",
  },
  articleThumbnail: {
    width: "80px",
    height: "60px",
    objectFit: "cover" as const,
    borderRadius: "4px",
  },
  articleActions: {
    display: "flex",
    gap: "10px",
  },
  editButton: {
    padding: "5px 15px",
    backgroundColor: "#ffc107",
    color: "#212529",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  // بقیه استایل‌ها مانند قبل
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
  // formGroup: {
  //   display: "flex",
  //   flexDirection: "column" as const,
  //   gap: "5px",
  // },
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


  /* استایل‌های مدیریت شبکه‌های اجتماعی */
  socialLinksList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },

  socialLinkItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
    gap: '10px',
  },

  socialLinkInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  socialPlatform: {
    fontWeight: 'bold',
    fontSize: '16px',
    textTransform: 'capitalize' as const,
    minWidth: '100px',
  },

  socialUrl: {
    flex: 1,
    color: '#007bff',
    fontSize: '14px',
    wordBreak: 'break-all' as const,
    marginRight: '15px',
  },

  socialLinkActions: {
    display: 'flex',
    gap: '10px',
  },

  activeButton: {
    padding: '5px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    minWidth: '80px',
  },

  inactiveButton: {
    padding: '5px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    minWidth: '80px',
  },

  socialLinkEdit: {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #dee2e6',
    marginTop: '10px',
  },

  /* استایل‌های مدیریت دسته‌بندی‌ها */
  categoriesList: {
    marginTop: '30px',
  },

  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },

  categoryItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'white',
  },

  categoryImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover' as const,
  },

  categoryInfo: {
    padding: '15px',
    flex: 1,
  },

  categoryTitle: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    color: '#333',
  },

  categoryDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
    lineHeight: '1.5',
  },

  categoryMeta: {
    fontSize: '12px',
    color: '#888',
  },

  categoryActions: {
    display: 'flex',
    padding: '10px 15px',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #dee2e6',
  },

  /* استایل‌های مدیریت محصولات */
  productsList: {
    marginTop: '30px',
  },

  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },

  productItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'white',
  },

  productImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover' as const,
  },

  productInfo: {
    padding: '15px',
    flex: 1,
  },

  productTitle: {
    margin: '0 0 5px 0',
    fontSize: '14px',
    color: '#333',
    fontWeight: 'bold',
  },

  productCategory: {
    fontSize: '12px',
    color: '#6c757d',
    marginBottom: '10px',
  },

  productPrice: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#28a745',
  },

  discount: {
    fontSize: '12px',
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    padding: '3px 8px',
    borderRadius: '4px',
  },

  productActions: {
    display: 'flex',
    padding: '10px 15px',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #dee2e6',
  },

  /* استایل‌های فرم‌ها */
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
    marginBottom: '30px',
  },

  formRow: {
    display: 'flex',
    gap: '20px',
  },

  formGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  selectInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: 'white',
  },

  numberInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100px',
  },

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    marginBottom: '15px',
  },

  /* استایل‌های Carousel */
  settingsForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    marginBottom: '30px',
  },

  carouselUpload: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #ddd',
  },

  carouselList: {
    marginTop: '20px',
  },

  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '15px',
  },

  carouselImageItem: {
    textAlign: 'center' as const,
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: 'white',
  },

  carouselImage: {
    width: '100%',
    height: '120px',
    objectFit: 'cover' as const,
    borderRadius: '4px',
    marginBottom: '10px',
  },

  /* استایل‌های عمومی */
  noData: {
    textAlign: 'center' as const,
    color: '#6c757d',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontStyle: 'italic' as const,
  },




};

export default AdminPage;