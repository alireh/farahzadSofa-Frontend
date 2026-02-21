// components/CommonQuestions.tsx
import React, { useState } from 'react';
import '../style2/CommonQuestions.css';

interface Question {
  id: number;
  question: string;
  answer: string;
}

const CommonQuestions: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(0);

  const questions: Question[] = [
    {
      id: 1,
      question: 'بهترین نوع پارچه برای مبلمان چیست؟',
      answer: 'پارچه‌های مخمل، کتان و میکروفایبر از بهترین گزینه‌ها هستند. مخمل برای مجالس رسمی، کتان برای استفاده روزمره و میکروفایبر برای خانواده‌های دارای کودک مناسب‌تر است.'
    },
    {
      id: 2,
      question: 'چگونه از مبلمان چرمی مراقبت کنیم؟',
      answer: 'از مواد شوینده قوی استفاده نکنید، هر ماه با دستمال مرطوب تمیز کنید، از تابش مستقیم نور خورشید دور نگه دارید و هر ۶ ماه یکبار از نرم‌کننده چرم استفاده کنید.'
    },
    {
      id: 3,
      question: 'مدت زمان تحویل سفارش چقدر است؟',
      answer: 'محصولات آماده ۳ تا ۵ روز کاری و محصولات سفارشی ۱۵ تا ۲۰ روز کاری تحویل داده می‌شوند. زمان دقیق پس از ثبت سفارش به شما اعلام خواهد شد.'
    },
    {
      id: 4,
      question: 'آیا امکان بازگشت کالا وجود دارد؟',
      answer: 'بله، تا ۷ روز پس از تحویل کالا در صورت عدم استفاده و حفظ بسته‌بندی اصلی، امکان بازگشت وجود دارد. هزینه بازگشت بر عهده مشتری است.'
    },
    {
      id: 5,
      question: 'چگونه ابعاد مناسب مبلمان را انتخاب کنیم؟',
      answer: 'ابتدا فضای مورد نظر را اندازه‌گیری کنید، سپس با در نظر گرفتن ۷۰ سانتیمتر فضای رفت و آمد، ابعاد مناسب را انتخاب کنید. تیم مشاوره ما رایگان شما را راهنمایی می‌کند.'
    },
    {
      id: 6,
      question: 'آیا گارانتی دارید؟',
      answer: 'بله، تمام محصولات دارای ۱۸ ماه گارانتی در برابر شکستگی اسکلت و ۶ ماه گارانتی پارچه هستند.'
    },
    {
      id: 7,
      question: 'روش‌های پرداخت چیست؟',
      answer: 'پرداخت آنلاین، کارت به کارت و پرداخت در محل (فقط برای تهران) امکان‌پذیر است.'
    },
    {
      id: 8,
      question: 'آیا امکان خرید اقساطی وجود دارد؟',
      answer: 'بله، از طریق همکاری با چند بانک، امکان خرید اقساطی تا ۱۲ ماه فراهم شده است.'
    },
    {
      id: 9,
      question: 'چگونه از اصالت کالا مطمئن شویم؟',
      answer: 'همه محصولات با هولوگرام و کد رهگیری ارائه می‌شوند. با اسکن QR کد روی محصول، اطلاعات کامل و اصالت کالا قابل استعلام است.'
    },
    {
      id: 10,
      question: 'آیا خدمات پس از فروش دارید؟',
      answer: 'بله، تا ۵ سال خدمات پس از فروش شامل تعمیرات، تعویض پارچه و شستشوی تخصصی با ۳۰٪ تخفیف ارائه می‌شود.'
    }
  ];

  const toggleQuestion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="common-questions">
      <h2 className="section-title">سوالات متداول</h2>
      <div className="questions-container">
        {questions.map((q) => (
          <div key={q.id} className={`question-item ${openId === q.id ? 'active' : ''}`}>
            <div className="question-header" onClick={() => toggleQuestion(q.id)}>
              <h3>{q.question}</h3>
              <span className="toggle-icon">{openId === q.id ? '−' : '+'}</span>
            </div>
            {openId === q.id && (
              <div className="answer">
                <p>{q.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommonQuestions;