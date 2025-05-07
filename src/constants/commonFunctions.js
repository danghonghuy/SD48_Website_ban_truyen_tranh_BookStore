export function getMediaUrl(url) {
  return process.env.REACT_APP_API_KEY + url;
}

export function formatCurrencyVND(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
