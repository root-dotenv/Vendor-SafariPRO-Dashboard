import { useState, useEffect, useCallback } from "react";
import { IoSearch, IoChevronUp, IoChevronDown, IoClose } from "react-icons/io5";
import { DOMSearchService } from "../../../services/DOMSearchService";
import styles from "./search-bar.module.css";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({
  onSearch,
  placeholder = "Search something...",
  className = "",
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [searchStats, setSearchStats] = useState({ total: 0, current: 0 });
  const [isSearching, setIsSearching] = useState(false);
  const searchService = DOMSearchService.getInstance();

  // Debounced search function
  const debouncedSearch = useCallback(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setIsSearching(true);
        const stats = searchService.search(query.trim());
        setSearchStats(stats);
        setIsSearching(false);

        // Call external onSearch callback if provided
        if (onSearch) {
          onSearch(query.trim());
        }
      } else {
        searchService.clearHighlights();
        setSearchStats({ total: 0, current: 0 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch, searchService]);

  // Effect to trigger search when query changes
  useEffect(() => {
    const cleanup = debouncedSearch();
    return cleanup;
  }, [debouncedSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      searchService.clearHighlights();
    };
  }, [searchService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const stats = searchService.search(query.trim());
      setSearchStats(stats);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleNextMatch = () => {
    if (searchStats.total > 0) {
      const stats = searchService.navigateNext();
      setSearchStats(stats);
    }
  };

  const handlePreviousMatch = () => {
    if (searchStats.total > 0) {
      const stats = searchService.navigatePrevious();
      setSearchStats(stats);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    searchService.clearHighlights();
    setSearchStats({ total: 0, current: 0 });
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        handlePreviousMatch();
      } else if (searchStats.total > 0) {
        e.preventDefault();
        handleNextMatch();
      }
    } else if (e.key === "Escape") {
      handleClearSearch();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.searchContainer} ${className}`}
    >
      <div className={styles.searchInputWrapper}>
        <IoSearch className={styles.searchIcon} size={20} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.searchInput}
          autoComplete="off"
        />

        {/* Search Stats */}
        {query && (
          <div className={styles.searchStats}>
            {isSearching ? (
              <span className={styles.searching}>...</span>
            ) : (
              <span className={styles.statsText}>
                {searchStats.total > 0
                  ? `${searchStats.current}/${searchStats.total}`
                  : "No results"}
              </span>
            )}
          </div>
        )}

        {/* Navigation Controls */}
        {query && searchStats.total > 0 && (
          <div className={styles.searchControls}>
            <button
              type="button"
              onClick={handlePreviousMatch}
              className={styles.navButton}
              title="Previous match (Shift+Enter)"
              disabled={searchStats.total <= 1}
            >
              <IoChevronUp size={16} />
            </button>
            <button
              type="button"
              onClick={handleNextMatch}
              className={styles.navButton}
              title="Next match (Enter)"
              disabled={searchStats.total <= 1}
            >
              <IoChevronDown size={16} />
            </button>
          </div>
        )}

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClearSearch}
            className={styles.clearButton}
            title="Clear search (Esc)"
          >
            <IoClose size={18} />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
