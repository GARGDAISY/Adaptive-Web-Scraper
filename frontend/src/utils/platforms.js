
export const PLATFORMS = {
  amazon: {
    name: "Amazon",
    icon: "🛒",
    color: "#FF9900",
    bg: "rgba(255,153,0,0.1)",
    border: "rgba(255,153,0,0.25)",
    searchUrl: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
  },
  flipkart: {
    name: "Flipkart",
    icon: "🛍️",
    color: "#2874F0",
    bg: "rgba(40,116,240,0.1)",
    border: "rgba(40,116,240,0.25)",
    searchUrl: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
  },
  nike: {
    name: "Nike",
    icon: "👟",
    color: "#FFFFFF",
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.18)",
    searchUrl: (q) => `https://www.nike.com/in/search?q=${encodeURIComponent(q)}`,
  },
  myntra: {
    name: "Myntra",
    icon: "👗",
    color: "#FF3F6C",
    bg: "rgba(255,63,108,0.1)",
    border: "rgba(255,63,108,0.25)",
    searchUrl: (q) => `https://www.myntra.com/${encodeURIComponent(q)}`,
  },
  nykaa: {
    name: "Nykaa",
    icon: "💄",
    color: "#E6437A",
    bg: "rgba(230,67,122,0.1)",
    border: "rgba(230,67,122,0.25)",
    searchUrl: (q) => `https://www.nykaa.com/search/result/?q=${encodeURIComponent(q)}`,
  },
  meesho: {
    name: "Meesho",
    icon: "🏷️",
    color: "#9B2FCB",
    bg: "rgba(155,47,203,0.1)",
    border: "rgba(155,47,203,0.25)",
    searchUrl: (q) => `https://www.meesho.com/search?q=${encodeURIComponent(q)}`,
  },
  snapdeal: {
    name: "Snapdeal",
    icon: "📦",
    color: "#E40020",
    bg: "rgba(228,0,32,0.1)",
    border: "rgba(228,0,32,0.25)",
    searchUrl: (q) => `https://www.snapdeal.com/search?keyword=${encodeURIComponent(q)}`,
  },
  croma: {
    name: "Croma",
    icon: "📱",
    color: "#00A86B",
    bg: "rgba(0,168,107,0.1)",
    border: "rgba(0,168,107,0.25)",
    searchUrl: (q) => `https://www.croma.com/searchB?q=${encodeURIComponent(q)}`,
  },
  ajio: {
    name: "Ajio",
    icon: "✨",
    color: "#F06C2A",
    bg: "rgba(240,108,42,0.1)",
    border: "rgba(240,108,42,0.25)",
    searchUrl: (q) => `https://www.ajio.com/search/?text=${encodeURIComponent(q)}`,
  },
  "reliance digital": {
    name: "Reliance Digital",
    icon: "🔌",
    color: "#0078D7",
    bg: "rgba(0,120,215,0.1)",
    border: "rgba(0,120,215,0.25)",
    searchUrl: (q) => `https://www.reliancedigital.in/search?q=${encodeURIComponent(q)}`,
  },
  "tata cliq": {
    name: "Tata CLiQ",
    icon: "🏬",
    color: "#D0021B",
    bg: "rgba(208,2,27,0.1)",
    border: "rgba(208,2,27,0.25)",
    searchUrl: (q) => `https://www.tatacliq.com/search/#q=${encodeURIComponent(q)}`,
  },
};

export function getPlatform(name) {
  if (!name) return null;
  return PLATFORMS[name.toLowerCase()] || {
    name,
    icon: "🛒",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.25)",
    searchUrl: (q) => `https://www.google.com/search?q=${encodeURIComponent(name + " " + q)}`,
  };
}

export function extractPrice(priceStr) {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
}

export const POPULAR_SEARCHES = [
  "iPhone 15 Pro 256GB",
  "Samsung Galaxy S24",
  "Nike Air Max 270",
  "boAt Airdopes 141",
  "Sony WH-1000XM5",
  "MacBook Air M2",
  "OnePlus 12",
  "Samsung 55 inch 4K TV",
  "Dyson V15 Detect",
  "Lakme foundation",
  "Adidas Ultraboost",
  "Kindle Paperwhite",
  "Instant Pot Duo",
  "Boat Rockerz 450",
];
