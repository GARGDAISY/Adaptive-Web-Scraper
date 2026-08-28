# 🛰️ Adaptive Web Scraper

### Smart Price Comparison for Online Shopping

**PriceRadar** is a full-stack web application that helps users compare product prices across multiple online marketplaces in one place. It provides price, ratings, discounts, and product links to make shopping comparisons faster and easier.

## ✨ Features

* 🔍 Search products by name or keyword
* 💰 Compare prices across multiple marketplaces
* 🏆 Highlight the lowest available price
* ⭐ View ratings and reviews
* 🏷️ Check discounts and offers
* 📊 Visual price comparison
* 🔗 Direct links to product pages
* 📱 Responsive user interface

## 🛠️ Tech Stack

* **Frontend:** React, CSS, Axios
* **Backend:** Node.js, Express.js
* **Data:** SerpApi / Google Shopping

## 📁 Project Structure

```text
priceradar/
├── backend/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## 🚀 Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`

## 🔑 Environment Variables

Create a `backend/.env` file:

```env
SERPAPI_API_KEY=your_api_key
PORT=5000
```

## 📌 Note

Prices, discounts, ratings, and availability may change. Always verify the final details on the respective seller's website before purchasing.

## 📄 License

MIT License

---

**Built by Nandini Garg**
