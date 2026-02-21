// components/UserMessages.tsx
import React, { useState } from 'react';
import '../style2/UserMessages.css';

interface Message {
  id: number;
  name: string;
  phone: string;
  message: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const UserMessages: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      name: 'علی رضایی',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      message: 'مبلمانی که خریدم کیفیت عالی داشت. ممنون از تیم خوبتون',
      date: '۱۴۰۴/۱۱/۲۰',
      status: 'approved'
    },
    {
      id: 2,
      name: 'سارا احمدی',
      phone: '۰۹۳۵۶۷۸۹۰۱۲',
      message: 'خیلی زود تحویل دادن. بسته‌بندی عالی بود',
      date: '۱۴۰۴/۱۱/۱۸',
      status: 'approved'
    },
    {
      id: 3,
      name: 'مهدی کریمی',
      phone: '۰۹۱۸۷۶۵۴۳۲۱',
      message: 'پشتیبانی خیلی خوبی دارید. سوالات من رو کامل جواب دادن',
      date: '۱۴۰۴/۱۱/۱۵',
      status: 'approved'
    }
  ]);

  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const errors = {
      name: '',
      phone: '',
      message: ''
    };
    
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'نام را وارد کنید';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'شماره موبایل را وارد کنید';
      isValid = false;
    } else if (!/^(\+98|0)?9\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'شماره موبایل معتبر نیست';
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = 'پیام را وارد کنید';
      isValid = false;
    } else if (formData.message.length < 10) {
      errors.message = 'پیام باید حداقل ۱۰ کاراکتر باشد';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // اینجا می‌توانید به API ارسال کنید
      setSubmitStatus('success');
      
      // اضافه کردن به لیست (برای نمایش)
      const newMessage: Message = {
        id: messages.length + 1,
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        date: new Date().toLocaleDateString('fa-IR'),
        status: 'pending'
      };
      
      setMessages([newMessage, ...messages]);
      
      // ریست فرم
      setFormData({ name: '', phone: '', message: '' });
      
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // پاک کردن خطا هنگام تایپ
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section className="user-messages">
      <h2 className="section-title">پیام‌های کاربران</h2>
      
      <div className="messages-container">
        <div className="messages-list">
          {messages.filter(m => m.status === 'approved').map(msg => (
            <div key={msg.id} className="message-card">
              <div className="message-header">
                <span className="user-name">{msg.name}</span>
                <span className="message-date">{msg.date}</span>
              </div>
              <p className="message-text">{msg.message}</p>
            </div>
          ))}
        </div>

        <div className="message-form-container">
          <h3>نظر خود را بنویسید</h3>
          <form onSubmit={handleSubmit} className="message-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="نام و نام خانوادگی"
                value={formData.name}
                onChange={handleChange}
                className={formErrors.name ? 'error' : ''}
              />
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="شماره موبایل"
                value={formData.phone}
                onChange={handleChange}
                className={formErrors.phone ? 'error' : ''}
              />
              {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
            </div>

            <div className="form-group">
              <textarea
                name="message"
                placeholder="پیام شما..."
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className={formErrors.message ? 'error' : ''}
              />
              {formErrors.message && <span className="error-message">{formErrors.message}</span>}
            </div>

            <button type="submit" className="submit-btn">ارسال پیام</button>
            
            {submitStatus === 'success' && (
              <div className="success-message">✅ پیام شما با موفقیت ارسال شد</div>
            )}
            
            {submitStatus === 'error' && (
              <div className="error-message global">❌ خطا در ارسال پیام. دوباره تلاش کنید</div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserMessages;