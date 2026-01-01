export function toPersianDigits(text) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    return text.toString().replace(/\d/g, (digit) => persianDigits[digit]);
}

export function getImgUrl(hostUrl, url) {
    let path = hostUrl.toString();
    path = path.endsWith('/') ? path : `${path}/`;
    let imgPath = url;
    imgPath = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
    return `${hostUrl}${url}`;
}
