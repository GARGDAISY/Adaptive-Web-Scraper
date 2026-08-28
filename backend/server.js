import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

app.use(helmet());
app.use(express.json({ limit: "20kb" }));

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || process.env.NODE_ENV === "development") return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || "30", 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a moment and try again." },
});

app.use("/api/", limiter);

app.get("/", (req, res) => {
  res.json({
    message: "PriceRadar SerpApi backend is running",
    health: "/health",
    compare: "POST /api/compare",
    suggestions: "/api/suggestions",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    version: "4.0.0-serpapi",
    timestamp: new Date().toISOString(),
    provider: "SerpApi",
    engine: "google_shopping",
  });
});

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function formatINR(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "";
  return `₹${Math.round(num).toLocaleString("en-IN")}`;
}

function priceToNumber(price) {
  const n = parseFloat(String(price || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
}

function inferCategory(query) {
  const q = query.toLowerCase();

  if (
    q.includes("shoe") ||
    q.includes("sneaker") ||
    q.includes("nike") ||
    q.includes("shirt") ||
    q.includes("jeans") ||
    q.includes("dress")
  ) {
    return "Fashion";
  }

  if (
    q.includes("lipstick") ||
    q.includes("foundation") ||
    q.includes("serum") ||
    q.includes("cream") ||
    q.includes("makeup")
  ) {
    return "Beauty";
  }

  if (
    q.includes("iphone") ||
    q.includes("samsung") ||
    q.includes("laptop") ||
    q.includes("earbuds") ||
    q.includes("tv") ||
    q.includes("phone") ||
    q.includes("camera") ||
    q.includes("headphone")
  ) {
    return "Electronics";
  }

  return "General";
}

function getPlatformName(source) {
  const s = cleanText(source).toLowerCase();

  if (s.includes("amazon")) return "Amazon";
  if (s.includes("flipkart")) return "Flipkart";
  if (s.includes("myntra")) return "Myntra";
  if (s.includes("nykaa")) return "Nykaa";
  if (s.includes("ajio")) return "Ajio";
  if (s.includes("croma")) return "Croma";
  if (s.includes("reliance")) return "Reliance Digital";
  if (s.includes("tatacliq") || s.includes("tata cliq")) return "Tata Cliq";
  if (s.includes("meesho")) return "Meesho";
  if (s.includes("snapdeal")) return "Snapdeal";

  return cleanText(source) || "Unknown";
}

function normalizeShoppingResult(item) {
  const extractedPrice =
    item?.price ||
    item?.extracted_price ||
    item?.offers?.[0]?.price ||
    item?.offers?.[0]?.extracted_price ||
    null;

  const originalPrice =
    item?.old_price ||
    item?.extracted_old_price ||
    item?.offers?.[0]?.old_price ||
    item?.offers?.[0]?.extracted_old_price ||
    null;

  const source =
    item?.source ||
    item?.merchant ||
    item?.seller ||
    item?.store ||
    item?.offers?.[0]?.source ||
    "";

  const link =
    item?.product_link ||
    item?.link ||
    item?.offers?.[0]?.link ||
    "";

  const rating =
    item?.rating ||
    item?.reviews?.rating ||
    "";

  const reviews =
    item?.reviews ||
    item?.reviews_count ||
    "";

  const title =
    item?.title ||
    item?.product_title ||
    "";

  if (!title || !extractedPrice) return null;

  const numericPrice =
    typeof extractedPrice === "number"
      ? extractedPrice
      : parseFloat(String(extractedPrice).replace(/[^\d.]/g, ""));

  if (!Number.isFinite(numericPrice)) return null;

  const numericOriginal =
    typeof originalPrice === "number"
      ? originalPrice
      : parseFloat(String(originalPrice || "").replace(/[^\d.]/g, ""));

  let discount = "";
  if (Number.isFinite(numericOriginal) && numericOriginal > numericPrice) {
    discount = `${Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100)}%`;
  }

  return {
    platform: getPlatformName(source),
    price: formatINR(numericPrice),
    originalPrice: Number.isFinite(numericOriginal) ? formatINR(numericOriginal) : "",
    discount,
    rating: rating ? String(rating) : "",
    reviews: reviews ? String(reviews) : "",
    availability: "Check seller page",
    delivery: "",
    seller: cleanText(source),
    emi: "",
    warranty: "",
    highlights: [],
    url: link,
    product: cleanText(title),
  };
}

function buildResponse(query, items) {
  const platforms = items
    .filter(Boolean)
    .sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));

  const minPrice = platforms.length ? platforms[0].price : "";
  const maxPrice = platforms.length ? platforms[platforms.length - 1].price : "";
  const cheapestPlatform = platforms[0]?.platform || "N/A";
  const product = platforms[0]?.product || query;

  return {
    product,
    category: inferCategory(query),
    summary: platforms.length
      ? `Found ${platforms.length} shopping results. Lowest visible price currently appears on ${cheapestPlatform}.`
      : "No reliable shopping results found.",
    lastUpdated: "just now",
    priceRange: {
      min: minPrice,
      max: maxPrice,
      currency: "INR",
    },
    platforms,
    specs: [],
    buyingAdvice: platforms.length
      ? "Check the final seller page before buying because live prices, delivery, and offers can change quickly."
      : "Try a more specific product name with model, storage, size, or color.",
    priceHistory: "",
    alternatives: [],
  };
}

async function fetchShoppingResults(query) {
  const response = await axios.get("https://serpapi.com/search.json", {
    params: {
      engine: "google_shopping",
      q: query,
      api_key: SERPAPI_API_KEY,
      gl: process.env.SERPAPI_GL || "in",
      hl: process.env.SERPAPI_HL || "en",
      num: parseInt(process.env.SERPAPI_NUM || "20", 10),
    },
    timeout: 30000,
  });

  return response.data;
}

app.post("/api/compare", async (req, res) => {
  const { query } = req.body || {};

  if (!query || typeof query !== "string" || query.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Please provide a valid product name (at least 2 characters)." });
  }

  if (!SERPAPI_API_KEY || SERPAPI_API_KEY === "your_serpapi_key_here") {
    return res.status(500).json({
      error: "API key not configured. Please set SERPAPI_API_KEY in backend/.env.",
    });
  }

  try {
    const raw = await fetchShoppingResults(query.trim());

    const shoppingResults = Array.isArray(raw?.shopping_results)
      ? raw.shopping_results
      : [];

    const normalized = shoppingResults
      .map(normalizeShoppingResult)
      .filter(Boolean);

    if (!normalized.length) {
      return res.status(422).json({
        error: "No shopping results found. Try a more specific product name.",
      });
    }

    return res.json({
      success: true,
      data: buildResponse(query.trim(), normalized),
    });
  } catch (err) {
    console.error("SerpApi error:", err?.response?.data || err.message);

    const apiMessage =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "SerpApi request failed.";

    if (err?.response?.status === 401) {
      return res.status(500).json({
        error: "Invalid SerpApi key. Check your SERPAPI_API_KEY.",
      });
    }

    if (err?.response?.status === 429) {
      return res.status(429).json({
        error: "SerpApi rate limit reached. Try again later.",
      });
    }

    return res.status(500).json({
      error: apiMessage,
    });
  }
});

app.get("/api/suggestions", (req, res) => {
  res.json({
    suggestions: [
      "iPhone 15 Pro 256GB",
      "Samsung Galaxy S24",
      "Nike Air Max 270",
      "boAt Airdopes 141",
      "Sony WH-1000XM5",
      "MacBook Air M2",
      "Lakme foundation",
      "Adidas Ultraboost 22",
    ],
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err?.stack || err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`\n🛰️ PriceRadar SerpApi backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Compare API: POST http://localhost:${PORT}/api/compare`);
  console.log(`🛒 Engine: google_shopping`);
  console.log(`\n⚠️ Make sure SERPAPI_API_KEY is set in backend/.env\n`);
});