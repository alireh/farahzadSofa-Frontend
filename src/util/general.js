export function toPersianDigits(text) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    return text.toString().replace(/\d/g, (digit) => persianDigits[digit]);
}
