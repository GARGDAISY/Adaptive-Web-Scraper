
import { getPlatform, extractPrice } from "../utils/platforms.js";
import styles from "./PriceCard.module.css";

function StarRating({ rating }) {
  const r = parseFloat(rating) || 0;
  const full  = Math.floor(r);
  const half  = r - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className={styles.stars} title={`${rating} / 5`}>
      {"★".repeat(full)}
      {half ? "⭑" : ""}
      {"☆".repeat(empty)}
      <span className={styles.ratingNum}>{rating}</span>
    </span>
  );
}

export default function PriceCard({ item, rank, totalItems, searchQuery }) {
  const p = getPlatform(item.platform);
  const isBest    = rank === 0;
  const isWorst   = rank === totalItems - 1 && totalItems > 2;
  const priceDiff = null; 

  const visitUrl = item.url && item.url !== "#"
    ? item.url
    : p.searchUrl(searchQuery || item.product || "");

  return (
    <div
      className={`${styles.card} ${isBest ? styles.best : ""} ${isWorst ? styles.worst : ""}`}
      style={{ animationDelay: `${rank * 0.06}s` }}
    >
      {/* Rank badge */}
      {isBest && (
        <div className={styles.bestBadge}>
          🏆 Best Price
        </div>
      )}
      {rank === 1 && (
        <div className={styles.rankBadge} style={{ background: "rgba(148,163,184,0.15)", color: "#94a3b8" }}>
          🥈 2nd Best
        </div>
      )}
      {rank === 2 && (
        <div className={styles.rankBadge} style={{ background: "rgba(205,127,50,0.12)", color: "#cd7f32" }}>
          🥉 3rd Best
        </div>
      )}

      {/* Platform header */}
      <div className={styles.platformRow}>
        <div
          className={styles.platformBadge}
          style={{ background: p.bg, border: `1px solid ${p.border}`, color: p.color }}
        >
          <span>{p.icon}</span>
          <span>{item.platform}</span>
        </div>
        <span
          className={styles.availability}
          style={{
            color: item.availability === "In Stock" ? "var(--green)" : "var(--red)",
            background: item.availability === "In Stock" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          }}
        >
          {item.availability === "In Stock" ? "✓ In Stock" : `✗ ${item.availability || "Check site"}`}
        </span>
      </div>

      {/* Price */}
      <div className={styles.priceRow}>
        <span className={styles.price}>{item.price}</span>
        {item.discount && (
          <span className={styles.discountBadge}>{item.discount} OFF</span>
        )}
      </div>

      {item.originalPrice && item.originalPrice !== item.price && (
        <div className={styles.originalPrice}>
          MRP: <s>{item.originalPrice}</s>
        </div>
      )}

      {/* Rating */}
      {item.rating && (
        <div className={styles.ratingRow}>
          <StarRating rating={item.rating} />
          {item.reviews && (
            <span className={styles.reviews}>{item.reviews} reviews</span>
          )}
        </div>
      )}

      {/* Meta info */}
      <div className={styles.meta}>
        {item.delivery && (
          <div className={styles.metaItem}>
            <span>🚚</span> {item.delivery}
          </div>
        )}
        {item.seller && (
          <div className={styles.metaItem}>
            <span>🏪</span> Sold by: {item.seller}
          </div>
        )}
        {item.warranty && (
          <div className={styles.metaItem}>
            <span>🛡️</span> {item.warranty}
          </div>
        )}
        {item.emi && (
          <div className={styles.metaItem}>
            <span>💳</span> {item.emi}
          </div>
        )}
      </div>

      {/* Highlights */}
      {item.highlights?.length > 0 && (
        <ul className={styles.highlights}>
          {item.highlights.slice(0, 3).map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <a
        href={visitUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cta}
        style={{ background: `linear-gradient(135deg, ${p.color}22, ${p.color}44)`, borderColor: p.border, color: p.color }}
      >
        View on {item.platform} →
      </a>
    </div>
  );
}
