import { useState } from "react";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";
import LoadingState from "./components/LoadingState.jsx";
import { useCompare } from "./hooks/useCompare.js";
import { PLATFORMS } from "./utils/platforms.js";
import styles from "./App.module.css";

const PLATFORM_LIST = Object.values(PLATFORMS);

export default function App() {
  const { results, loading, error, lastQuery, search, clear } = useCompare();
  const [activeSearch, setActiveSearch] = useState("");

  const handleSearch = (query) => {
    setActiveSearch(query);
    search(query);
  };

  const handleNewSearch = () => {
    clear();
    setActiveSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.app}>
      <Header />

      <main>
        {!results && !loading && (
          <>
            <SearchBar onSearch={handleSearch} loading={loading} />

            {error && (
              <div className={styles.error}>
                <span>⚠️</span>
                <div>
                  <strong>Oops!</strong> {error}
                  <br />
                  <small>
                    Try being more specific, e.g. "iPhone 15 Pro 128GB" instead of "phone"
                  </small>
                </div>
              </div>
            )}

            <section className={styles.platformSection} id="platforms">
              <div className={styles.platformLabel}>COMPARING PRICES ACROSS</div>
              <div className={styles.platformList}>
                {PLATFORM_LIST.map((p) => (
                  <div
                    key={p.name}
                    className={styles.platformItem}
                    style={{ color: p.color }}
                  >
                    <span className={styles.platformIcon}>{p.icon}</span>
                    <span className={styles.platformName}>{p.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.howSection} id="how">
              <h2 className={styles.howTitle}>How Adaptive Web Scraper Works</h2>
              <div className={styles.steps}>
                {[
                  {
                    icon: "🔍",
                    title: "You Search",
                    desc: "Type any product name — from electronics to fashion to beauty",
                  },
                  {
                    icon: "🕸️",
                    title: "Scraper Collects",
                    desc: "The backend collects live product data from multiple supported platforms",
                  },
                  {
                    icon: "📊",
                    title: "You Compare",
                    desc: "See prices, ratings, discounts and reviews side by side instantly",
                  },
                  {
                    icon: "💰",
                    title: "You Save",
                    desc: "Open the best match and verify the final product page before purchase",
                  },
                ].map((step, i) => (
                  <div key={i} className={styles.step}>
                    <div className={styles.stepIcon}>{step.icon}</div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {loading && <LoadingState query={activeSearch} />}

        {results && !loading && (
          <>
            <div className={styles.miniSearch}>
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>
            <ResultsPanel
              data={results}
              searchQuery={lastQuery}
              onNewSearch={handleNewSearch}
            />
          </>
        )}
      </main>

      
    </div>
  );
}