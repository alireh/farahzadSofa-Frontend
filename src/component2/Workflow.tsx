// components/Workflow.tsx
import React from 'react';
import OptimizedImage from './OptimizedImage';
import '../style2/Workflow.css';

const Workflow: React.FC = () => {
  return (
    <section className="workflow">
      <div className="workflow-content">
        <h2>چرا مستقیم از کارخانه بخریم؟</h2>
        <div className="comparison">
          <div className="traditional">
            <h3>❌ روش سنتی</h3>
            <ul>
              <li>تولید کننده → عمده فروش → خرده فروش → شما</li>
              <li>➕ ۴۰-۶۰٪ افزایش قیمت</li>
              <li>⏱️ زمان تحویل طولانی</li>
              <li>📦 گارانتی محدود</li>
            </ul>
          </div>
          <div className="direct">
            <h3>✅ روش مستقیم (مبل فرحزاد)</h3>
            <ul>
              <li>تولید کننده → شما</li>
              <li>➖ ۴۰٪ صرفه جویی</li>
              <li>⏱️ تحویل سریع</li>
              <li>📦 گارانتی معتبر ۱۸ ماهه</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="workflow-image">
        <OptimizedImage
          desktopSrc="/uploads/workflow-desktop.webp"
          mobileSrc="/uploads/workflow-mobile.webp"
          alt="نمودار خرید مستقیم از کارخانه"
        />
      </div>
    </section>
  );
};

export default Workflow;