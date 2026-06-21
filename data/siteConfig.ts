export const siteConfig = {
  senderName: "Aku",
  recipientName: "kamu",
  whatsapp: {
    // Replace with the real number in international format, for example: 6281234567890
    number: "6281234567890",
    message: "Hii, paketnya udah sampaii 🤍"
  }
};

export function getWhatsAppUrl() {
  const number = siteConfig.whatsapp.number.replace(/[^\d]/g, "");
  const text = encodeURIComponent(siteConfig.whatsapp.message);
  return `https://wa.me/${number}?text=${text}`;
}
