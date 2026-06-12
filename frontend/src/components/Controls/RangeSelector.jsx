import styles from "./RangeSelector.module.css";

const QUICK_RANGES = [
  { label: "7 Days",  value: 7    },
  { label: "14 Days", value: 14   },
  { label: "30 Days", value: 30   },
  { label: "All",     value: null },
];

export default function RangeSelector({
  activeDays,
  onRangeChange,
  customFrom,
  customTo,
  onCustomChange,
  totalRecords,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.quickRow}>
        <span className={styles.sectionLabel}>Quick range</span>
        <div className={styles.pills}>
          {QUICK_RANGES.map(({ label, value }) => (
            <button
              key={label}
              className={`${styles.pill} ${activeDays === value && !customFrom ? styles.active : ""}`}
              onClick={() => onRangeChange(value)}
              aria-pressed={activeDays === value && !customFrom}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.customRow}>
        <span className={styles.sectionLabel}>Custom range</span>
        <div className={styles.dateInputs}>
          <input
            type="date"
            className={styles.dateInput}
            value={customFrom}
            onChange={(e) => onCustomChange(e.target.value, customTo)}
            aria-label="Start date"
          />
          <span className={styles.arrow}>→</span>
          <input
            type="date"
            className={styles.dateInput}
            value={customTo}
            onChange={(e) => onCustomChange(customFrom, e.target.value)}
            aria-label="End date"
          />
        </div>
      </div>

      <p className={styles.recordCount}>
        Showing <strong>{totalRecords}</strong> record{totalRecords !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
