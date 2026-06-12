import { useState } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useGHIData } from "./hooks/useGHIData";
import StatCard from "./components/Stats/StatCard";
import RangeSelector from "./components/Controls/RangeSelector";
import GHIChart from "./components/Chart/GHIChart";
import rawData from "./data/ghi_data.json";
import styles from "./App.module.css";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? "☀ Light" : "☽ Dark"}
    </button>
  );
}

function Dashboard() {
  const [activeDays, setActiveDays] = useState(14);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");

  const handleRangeChange = (days) => {
    setActiveDays(days);
    setCustomFrom("");
    setCustomTo("");
  };

  const handleCustomChange = (from, to) => {
    setCustomFrom(from);
    setCustomTo(to);
    if (from && to) setActiveDays(null);
  };

  const { data, stats, peakIndex } = useGHIData(rawData, activeDays, customFrom, customTo);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PV Doctor</p>
          <h1 className={styles.title}>GHI Dashboard</h1>
        </div>
        <ThemeToggle />
      </header>

      <section className={styles.statsGrid} aria-label="Statistics">
        <StatCard label="Maximum" value={stats.max} />
        <StatCard label="Minimum" value={stats.min} />
        <StatCard label="Average" value={stats.avg} />
      </section>

      <section className={styles.controlPanel} aria-label="Date range controls">
        <RangeSelector
          activeDays={activeDays}
          onRangeChange={handleRangeChange}
          customFrom={customFrom}
          customTo={customTo}
          onCustomChange={handleCustomChange}
          totalRecords={data.length}
        />
      </section>

      <section aria-label="GHI time series chart">
        {data.length > 0 ? (
          <GHIChart data={data} peakIndex={peakIndex} stats={stats} />
        ) : (
          <div className={styles.emptyState}>
            No records match the selected range. Try adjusting the date filters.
          </div>
        )}
      </section>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}
