import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🛰️</span>
          <div>
            <span className={styles.logoText}>Adaptive Web Scraper</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <a href="#how" className={styles.navLink}>How it works</a>
          <a href="#platforms" className={styles.navLink}>Platforms</a>
        </nav>
      </div>
    </header>
  );
}