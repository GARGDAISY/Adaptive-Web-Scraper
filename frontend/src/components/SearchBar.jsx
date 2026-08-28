import { useState, useRef, useEffect } from "react";
import { POPULAR_SEARCHES } from "../utils/platforms.js";
import styles from "./SearchBar.module.css";

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (query.trim() && !loading) onSearch(query.trim());
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const useSuggestion = (s) => {
    setQuery(s);
    onSearch(s);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.heroText}>
        <div className={styles.eyebrow}></div>
      
         <h1 className={styles.title}>
          Adaptive <span className="gradient-text">Web Scraper</span>
          <br />
          For Smart Product Search
        </h1> 
        <p className={styles.subtitle}>
          Search products, collect platform data, and compare results across major stores instantly
        </p>
      </div>

      <div className={`${styles.searchBox} ${focused ? styles.focused : ""}`}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search any product… e.g. iPhone 15 Pro, Nike Air Max, boAt Airdopes"
          disabled={loading}
          maxLength={200}
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button
            className={styles.clearBtn}
            onClick={() => setQuery("")}
            aria-label="Clear"
          >
            ✕
          </button>
        )}
        <button
          className={`${styles.searchBtn} ${loading ? styles.loading : ""}`}
          onClick={handleSubmit}
          disabled={!query.trim() || loading}
        >
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            <>
              Compare <span className={styles.arrow}>→</span>
            </>
          )}
        </button>
      </div>

      <div className={styles.suggestions}>
        <span className={styles.suggestLabel}>🔥 Popular:</span>
        {POPULAR_SEARCHES.slice(0, 6).map((s) => (
          <button
            key={s}
            className={styles.chip}
            onClick={() => useSuggestion(s)}
            disabled={loading}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}