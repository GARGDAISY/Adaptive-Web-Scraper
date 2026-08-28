
import { getPlatform, extractPrice } from "../utils/platforms.js";
import styles from "./PriceChart.module.css";

export default function PriceChart({ platforms }) {
  if (!platforms?.length) return null;

  const sorted = [...platforms].sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
  const maxPrice = extractPrice(sorted[sorted.length - 1]?.price) || 1;
  const minPrice = extractPrice(sorted[0]?.price) || 0;
  const savings  = maxPrice - minPrice;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>📊 Price Comparison Chart</h3>
        {savings > 0 && (
          <div className={styles.savingsPill}>
            Save up to ₹{savings.toLocaleString("en-IN")} by choosing wisely
          </div>
        )}
      </div>

      <div className={styles.chart}>
        {sorted.map((item, i) => {
          const p = getPlatform(item.platform);
          const price = extractPrice(item.price);
          const pct = Math.max(8, (price / maxPrice) * 100);
          const isBest = i === 0;

          return (
            <div key={item.platform} className={styles.row} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={styles.label}>
                <span>{p.icon}</span>
                <span className={styles.platformName}>{item.platform}</span>
              </div>

              <div className={styles.barTrack}>
                <div
                  className={`${styles.bar} ${isBest ? styles.barBest : ""}`}
                  style={{
                    width: `${pct}%`,
                    background: isBest
                      ? "linear-gradient(90deg, #22c55e, #16a34a)"
                      : `linear-gradient(90deg, ${p.color}88, ${p.color}bb)`,
                  }}
                >
                  <span className={styles.barPrice}>{item.price}</span>
                </div>
              </div>

              {item.discount && (
                <span className={styles.discTag}>{item.discount} off</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
