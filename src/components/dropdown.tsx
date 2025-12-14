
import React, { useState, useRef, useEffect } from 'react';
import "../dropdown.css";

export interface DropdownProps {
    /** عنوان دراپ‌دون */
    title: string;
    
    /** لیست آیتم‌ها */
    items: string[];
    
    /** تابعی که هنگام انتخاب آیتم فراخوانی می‌شود */
    onSelect?: (selectedItem: string, index: number) => void;
    
    /** ایندکس پیش‌فرض انتخاب شده (می‌تواند آرایه‌ای باشد برای حالت multiple) */
    defaultIndex?: number | number[];
    
    /** آیا دراپ‌دون باز باشد؟ */
    defaultOpen?: boolean;
    
    /** عرض دلخواه دراپ‌دون */
    width?: string;
    
    /** کلاس اضافی برای استایل‌دهی */
    className?: string;
    
    /** آیا غیرفعال باشد؟ */
    disabled?: boolean;
    
    /** متن placeholder وقتی هیچ آیتمی انتخاب نشده */
    placeholder?: string;
    
    /** آیا امکان انتخاب چندگانه وجود دارد؟ */
    multiple?: boolean;
    
    /** آیا انتخاب آیتم اجباری است؟ (نمی‌توان انتخاب را پاک کرد) */
    required?: boolean;
}


const Dropdown: React.FC<DropdownProps> = ({
    title,
    items,
    onSelect,
    defaultIndex,
    defaultOpen = false,
    width = '200px',
    className = '',
    disabled = false,
    placeholder = 'انتخاب کنید...',
    multiple = false,
    required = false
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // مقداردهی اولیه با defaultIndex
    useEffect(() => {
        const initializeSelection = () => {
            if (defaultIndex !== undefined) {
                if (Array.isArray(defaultIndex)) {
                    // حالت multiple
                    const selected = defaultIndex
                        .filter(index => index >= 0 && index < items.length)
                        .map(index => items[index]);
                    
                    setSelectedItems(selected);
                    setSelectedIndexes(defaultIndex.filter(index => index >= 0 && index < items.length));
                } else {
                    // حالت single
                    const index = defaultIndex;
                    if (index >= 0 && index < items.length) {
                        setSelectedItems([items[index]]);
                        setSelectedIndexes([index]);
                    }
                }
            }
        };

        initializeSelection();
    }, [defaultIndex, items]);

    // بستن دراپ‌دون با کلیک بیرون
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleItemClick = (item: string, index: number) => {
        if (multiple) {
            // حالت انتخاب چندگانه
            const newIndexes = selectedIndexes.includes(index)
                ? selectedIndexes.filter(i => i !== index)
                : [...selectedIndexes, index];
            
            const newSelected = newIndexes.map(i => items[i]);
            
            setSelectedIndexes(newIndexes);
            setSelectedItems(newSelected);
            
            if (onSelect) {
                onSelect(item, index);
            }
        } else {
            // حالت انتخاب تک‌گزینه‌ای
            setSelectedIndexes([index]);
            setSelectedItems([item]);
            
            if (onSelect) {
                onSelect(item, index);
            }
            
            setIsOpen(false);
        }
    };

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const getDisplayText = () => {
        if (selectedItems.length === 0) {
            return placeholder;
        }
        
        if (multiple) {
            return selectedItems.length === 1 
                ? selectedItems[0]
                : `${selectedItems.length} آیتم انتخاب شده`;
        }
        
        return selectedItems[0];
    };

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!required) {
            setSelectedItems([]);
            setSelectedIndexes([]);
        }
    };

    // تابع کمکی برای چک کردن اینکه آیا ایندکس انتخاب شده است
    const isItemSelected = (index: number) => {
        return selectedIndexes.includes(index);
    };

    return (
        <div 
            className={`dropdown ${className} ${disabled ? 'dropdown-disabled' : ''}`}
            ref={dropdownRef}
            style={{ width }}
            dir="rtl"
        >
            <div 
                className={`dropdown-header ${isOpen ? 'dropdown-open' : ''}`}
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                aria-disabled={disabled}
            >
                <div className="dropdown-header-content">
                    <span className="dropdown-title">{title}:</span>
                    <span className="dropdown-selected">{getDisplayText()}</span>
                </div>
                
                <div className="dropdown-icons">
                    {selectedItems.length > 0 && !required && (
                        <button 
                            className="dropdown-clear"
                            onClick={clearSelection}
                            aria-label="پاک کردن انتخاب"
                            type="button"
                        >
                            ✕
                        </button>
                    )}
                    <span className="dropdown-arrow">
                        {isOpen ? '▲' : '▼'}
                    </span>
                </div>
            </div>
            
            {isOpen && !disabled && (
                <div className="dropdown-list">
                    {items.length === 0 ? (
                        <div className="dropdown-no-items">
                            آیتمی برای نمایش وجود ندارد
                        </div>
                    ) : (
                        items.map((item, index) => {
                            const isSelected = isItemSelected(index);
                            
                            return (
                                <div
                                    key={`${item}-${index}`}
                                    className={`dropdown-item ${isSelected ? 'dropdown-item-selected' : ''}`}
                                    onClick={() => handleItemClick(item, index)}
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    {multiple && (
                                        <span className="dropdown-checkbox">
                                            {isSelected ? '✓' : '○'}
                                        </span>
                                    )}
                                    <span className="dropdown-item-text">{item}</span>
                                    {!multiple && isSelected && (
                                        <span className="dropdown-selected-indicator">✓</span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};


export default Dropdown;