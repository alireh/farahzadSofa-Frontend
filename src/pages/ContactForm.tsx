import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    error?: string;
    data?: {
        id: number;
        created_at: string;
    };
}

const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [touched, setTouched] = useState<{ [key in keyof ContactFormData]: boolean }>({
        name: false,
        email: false,
        message: false
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBlur = (field: keyof ContactFormData): void => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const validateForm = (): boolean => {
        const errors: string[] = [];

        if (!formData.name.trim()) {
            errors.push('نام الزامی است');
        }

        if (!formData.email.trim()) {
            errors.push('ایمیل الزامی است');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.push('فرمت ایمیل نامعتبر است');
        }

        if (!formData.message.trim()) {
            errors.push('متن پیام الزامی است');
        }

        if (errors.length > 0) {
            setError(errors.join('، '));
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post<ApiResponse>('/api/contact', formData);

            if (response.data.success) {
                setSuccess(true);
                setFormData({ name: '', email: '', message: '' });
                setTouched({ name: false, email: false, message: false });

                // ریست فرم بعد از 3 ثانیه
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(response.data.error || 'خطا در ارسال پیام');
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            setError(
                axiosError.response?.data?.error ||
                axiosError.message ||
                'خطا در ارسال پیام'
            );
        } finally {
            setLoading(false);
        }
    };

    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            maxWidth: '600px',
            margin: '40px auto',
            padding: '30px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Vazirmatn, Tahoma, sans-serif',
        },
        title: {
            textAlign: 'center' as const,
            color: '#2c3e50',
            marginBottom: '30px',
            fontSize: '24px',
            fontWeight: 600,
        },
        form: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '20px',
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column' as const,
        },
        label: {
            marginBottom: '8px',
            color: '#495057',
            fontWeight: 500,
            fontSize: '14px',
        },
        input: {
            padding: '12px 16px',
            border: '1px solid #ced4da',
            borderRadius: '8px',
            fontSize: '16px',
            transition: 'border-color 0.3s',
            outline: 'none',
            fontFamily: 'inherit',
        },
        textarea: {
            padding: '12px 16px',
            border: '1px solid #ced4da',
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'inherit',
            resize: 'vertical' as const,
            minHeight: '120px',
            transition: 'border-color 0.3s',
            outline: 'none',
        },
        submitButton: {
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '14px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            fontFamily: 'inherit',
        },
        disabledButton: {
            backgroundColor: '#95a5a6',
            cursor: 'not-allowed',
        },
        successMessage: {
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center' as const,
            border: '1px solid #c3e6cb',
        },
        errorMessage: {
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center' as const,
            border: '1px solid #f5c6cb',
        },
        errorText: {
            color: '#e74c3c',
            fontSize: '12px',
            marginTop: '5px',
            height: '20px',
        },
        charCount: {
            textAlign: 'left' as const,
            fontSize: '12px',
            color: '#6c757d',
            marginTop: '5px',
        },
    };

    const getFieldError = (field: keyof ContactFormData): string => {
        if (!touched[field]) return '';

        switch (field) {
            case 'name':
                return !formData.name.trim() ? 'نام الزامی است' : '';
            case 'email':
                if (!formData.email.trim()) return 'ایمیل الزامی است';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                    return 'فرمت ایمیل نامعتبر است';
                return '';
            case 'message':
                return !formData.message.trim() ? 'متن پیام الزامی است' : '';
            default:
                return '';
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>فرم تماس با ما</h2>

            {success && (
                <div style={styles.successMessage}>
                    ✅ پیام شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.
                </div>
            )}

            {error && (
                <div style={styles.errorMessage}>
                    ❌ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="name" style={styles.label}>
                        نام و نام خانوادگی *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        required
                        style={styles.input}
                        placeholder="نام خود را وارد کنید"
                    />
                    <div style={styles.errorText}>
                        {getFieldError('name')}
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>
                        آدرس ایمیل *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        required
                        style={styles.input}
                        placeholder="example@domain.com"
                    />
                    <div style={styles.errorText}>
                        {getFieldError('email')}
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="message" style={styles.label}>
                        متن پیام *
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={() => handleBlur('message')}
                        required
                        rows={6}
                        style={styles.textarea}
                        placeholder="پیام خود را اینجا بنویسید..."
                        maxLength={1000}
                    />
                    <div style={styles.charCount}>
                        {formData.message.length} / 1000 کاراکتر
                    </div>
                    <div style={styles.errorText}>
                        {getFieldError('message')}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        ...styles.submitButton,
                        ...(loading && styles.disabledButton)
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                        if (!loading) {
                            e.currentTarget.style.backgroundColor = '#2980b9';
                        }
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                        if (!loading) {
                            e.currentTarget.style.backgroundColor = '#3498db';
                        }
                    }}
                >
                    {loading ? 'در حال ارسال...' : 'ارسال پیام'}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;