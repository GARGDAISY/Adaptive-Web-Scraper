import styles from "./LoadingState.module.css";

const PLATFORMS_SCANNING = [
  "Amazon.in", "Flipkart", "Myntra", "Nike India",
  "Meesho", "Snapdeal", "Croma", "Nykaa", "Ajio", "Tata CLiQ"
];

export default function LoadingState({ query }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.satellite}>🛰️</div>
      <h3 className={styles.title}>Scanning for best prices…</h3>
      <p className={styles.subtitle}>
        Searching across all platforms for <strong>"{query}"</strong>
      </p>

      <div className={styles.platforms}>
        {PLATFORMS_SCANNING.map((name, i) => (
          <div
            key={name}
            className={styles.platformPill}
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            <span className={styles.dot} />
            {name}
          </div>
        ))}
      </div>

      {/* Skeleton preview */}
      <div className={styles.skeletonGrid}>
        {[0,1,2].map(i => (
          <div key={i} className={styles.skeletonCard} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`skeleton ${styles.skH}`} style={{ width: "60%", height: "14px" }} />
            <div className={`skeleton ${styles.skH}`} style={{ width: "40%", height: "32px", marginTop: "10px" }} />
            <div className={`skeleton ${styles.skH}`} style={{ width: "80%", height: "12px", marginTop: "8px" }} />
            <div className={`skeleton ${styles.skH}`} style={{ width: "70%", height: "12px", marginTop: "6px" }} />
            <div className={`skeleton ${styles.skH}`} style={{ width: "100%", height: "36px", marginTop: "14px", borderRadius: "8px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
