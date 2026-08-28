
import { useState, useMemo } from "react";
import PriceCard from "./PriceCard.jsx";
import PriceChart from "./PriceChart.jsx";
import { getPlatform, extractPrice } from "../utils/platforms.js";
import styles from "./ResultsPanel.module.css";

const SORT_OPTIONS = [
  { value: "price",    label: "💰 Price (Low → High)" },
  { value: "rating",   label: "⭐ Rating" },
  { value: "discount", label: "🏷️ Discount" },
];

export default function ResultsPanel({ data, searchQuery, onNewSearch }) {
  const [sort, setSort] = useState("price");
  const [filter, setFilter] = useState("All");

  const sorted = useMemo(() => {
    let list = [...(data.platforms || [])];

    if (filter !== "All") list = list.filter(p => p.platform === filter);

    if (sort === "price") {
      list.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
    } else if (sort === "rating") {
      list.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
    } else if (sort === "discount") {
      list.sort((a, b) => (parseFloat(b.discount) || 0) - (parseFloat(a.discount) || 0));
    }

    return list;
  }, [data.platforms, sort, filter]);

  const cheapest  = useMemo(() => {
    const prices = (data.platforms || []).map(p => extractPrice(p.price)).filter(Boolean);
    return Math.min(...prices);
  }, [data.platforms]);

  const highestRated = useMemo(() => {
    return [...(data.platforms || [])].sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))[0];
  }, [data.platforms]);

  return (
    <div className={styles.wrapper}>
      {/* Product Summary Card */}
      <div className={styles.summary}>
        <div className={styles.summaryLeft}>
          <div className={styles.categoryTag}>{data.category}</div>
          <h2 className={styles.productName}>{data.product}</h2>
          <p className={styles.summaryText}>{data.summary}</p>

          {data.buyingAdvice && (
            <div className={styles.advice}>
              <span>💡</span>
              <div>
                <strong>Buying Advice: </strong>{data.buyingAdvice}
              </div>
            </div>
          )}

          {data.priceHistory && (
            <div className={styles.priceHistory}>
              📈 {data.priceHistory}
            </div>
          )}
        </div>

        <div className={styles.summaryStats}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Best Price</div>
            <div className={styles.statValue} style={{ color: "var(--green)" }}>
              ₹{cheapest.toLocaleString("en-IN")}
            </div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Platforms</div>
            <div className={styles.statValue}>{data.platforms?.length}</div>
          </div>
          {highestRated && (
            <div className={styles.stat}>
              <div className={styles.statLabel}>Highest Rated</div>
              <div className={styles.statValue} style={{ fontSize: "15px" }}>
                {getPlatform(highestRated.platform)?.icon} {highestRated.platform}
              </div>
              <div style={{ fontSize: "11px", color: "var(--amber)", marginTop: "2px" }}>
                ★ {highestRated.rating}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Specs */}
      {data.specs?.length > 0 && (
        <div className={styles.specs}>
          {data.specs.map((s, i) => (
            <span key={i} className={styles.specChip}>{s}</span>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.sortGroup}>
          <span className={styles.controlLabel}>Sort:</span>
          {SORT_OPTIONS.map(o => (
            <button
              key={o.value}
              className={`${styles.sortBtn} ${sort === o.value ? styles.active : ""}`}
              onClick={() => setSort(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.controlLabel}>Filter:</span>
          <select
            className={styles.filterSelect}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="All">All Platforms</option>
            {data.platforms?.map(p => (
              <option key={p.platform} value={p.platform}>{p.platform}</option>
            ))}
          </select>
        </div>

        <button className={styles.newSearchBtn} onClick={onNewSearch}>
          🔍 New Search
        </button>
      </div>

      {/* Cards grid */}
      <div className={styles.grid}>
        {sorted.map((item, i) => (
          <PriceCard
            key={item.platform + i}
            item={item}
            rank={i}
            totalItems={sorted.length}
            searchQuery={searchQuery}
          />
        ))}
      </div>

      {/* Chart */}
      {sorted.length > 1 && filter === "All" && (
        <PriceChart platforms={sorted} />
      )}

      {/* Alternatives */}
      {data.alternatives?.length > 0 && (
        <div className={styles.alternatives}>
          <h3 className={styles.altTitle}>🔄 Similar Products to Consider</h3>
          <div className={styles.altGrid}>
            {data.alternatives.map((alt, i) => (
              <div key={i} className={styles.altCard}>
                <div className={styles.altName}>{alt.name}</div>
                <div className={styles.altMeta}>
                  <span className={styles.altPrice}>{alt.price}</span>
                  <span className={styles.altPlatform}>
                    {getPlatform(alt.platform)?.icon} {alt.platform}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
