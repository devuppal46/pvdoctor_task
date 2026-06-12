import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import styles from "./GHIChart.module.css";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { Date: date, GHI, isPeak } = payload[0].payload;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{date}</p>
      <p className={styles.tooltipGhi}>
        <span style={{ color: isPeak ? "var(--peak-dot)" : "var(--accent)" }}>
          {GHI.toFixed(2)}
        </span>
        <span className={styles.tooltipUnit}> kWh/m²</span>
      </p>
      {isPeak && <p className={styles.tooltipPeak}>⚡ Peak</p>}
    </div>
  );
}

function DataDot({ cx, cy, payload }) {
  if (cx == null || cy == null) return null;
  if (payload?.isPeak) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={12} fill="#f59e0b" opacity={0.12} />
        <circle cx={cx} cy={cy} r={7}  fill="none" stroke="#f59e0b" strokeWidth={1.5} opacity={0.5} />
        <circle cx={cx} cy={cy} r={4}  fill="#f59e0b" />
      </g>
    );
  }
  return <circle cx={cx} cy={cy} r={2.5} fill="#f97316" opacity={0.8} />;
}

export default function GHIChart({ data, peakIndex, stats }) {
  const { theme } = useTheme();

  const [zoomLeft,    setZoomLeft]    = useState("");
  const [zoomRight,   setZoomRight]   = useState("");
  const [zoomedData,  setZoomedData]  = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const isLarge = data.length > 60;

  const chartAreaRef = useRef(null);

  useEffect(() => {
    const el = chartAreaRef.current;
    if (!el) return;
    el.classList.remove(styles.chartAnimate);
    void el.offsetHeight;
    el.classList.add(styles.chartAnimate);
  }, [data.length]);

  const displayData = useMemo(() => {
    const sourceData = zoomedData ?? data;
    const zoomedMax = zoomedData ? Math.max(...zoomedData.map((x) => x.GHI)) : null;
    return sourceData.map((r, i) => ({
      ...r,
      isPeak: zoomedData ? r.GHI === zoomedMax : i === peakIndex,
    }));
  }, [data, zoomedData, peakIndex]);

  const handleMouseDown = useCallback((e) => {
    if (!e?.activeLabel) return;
    setZoomLeft(e.activeLabel);
    setZoomRight("");
    setIsSelecting(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isSelecting && e?.activeLabel) setZoomRight(e.activeLabel);
  }, [isSelecting]);

  const handleMouseUp = useCallback(() => {
    if (!isSelecting) return;
    setIsSelecting(false);
    if (!zoomLeft || !zoomRight || zoomLeft === zoomRight) {
      setZoomLeft("");
      setZoomRight("");
      return;
    }
    const [l, r] = [zoomLeft, zoomRight].sort();
    const slice = (zoomedData ?? data).filter((d) => d.Date >= l && d.Date <= r);
    if (slice.length > 1) setZoomedData(slice);
    setZoomLeft("");
    setZoomRight("");
  }, [isSelecting, zoomLeft, zoomRight, data, zoomedData]);

  const resetZoom = () => {
    setZoomedData(null);
    setZoomLeft("");
    setZoomRight("");
  };

  const values = displayData.map((r) => r.GHI);

  const dateSpanDays = displayData.length > 1
    ? (new Date(displayData[displayData.length - 1].Date) - new Date(displayData[0].Date)) / 86400000
    : 0;
  const tickStep = dateSpanDays > 730 ? 1.0 : 0.5;

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const yMin   = Math.max(0, Math.floor((rawMin - 0.3) / tickStep) * tickStep);
  const yMax   = Math.ceil((rawMax + 0.3) / tickStep) * tickStep;

  const yTicks = [];
  for (let t = yMin; t <= yMax + 1e-9; t = Math.round((t + tickStep) * 100) / 100) {
    yTicks.push(t);
  }

  const gradId = `ghiFill-${theme}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.chartLabel}>
          <span className={styles.legendDot} />
          <span className={styles.chartTitle}>GHI — kWh / m²</span>
        </div>
        <div className={styles.toolbarRight}>
          {zoomedData ? (
            <button className={styles.resetBtn} onClick={resetZoom}>
              ↩ Reset zoom
            </button>
          ) : (
            <span className={styles.zoomHint}>Drag to zoom</span>
          )}
        </div>
      </div>

      <div ref={chartAreaRef} className={styles.chartAnimate}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
          data={displayData}
          margin={{ top: 10, right: 12, bottom: 0, left: -4 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#f97316" stopOpacity={0.28} />
              <stop offset="60%"  stopColor="#f97316" stopOpacity={0.06} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0}    />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 4" vertical={false} />

          <XAxis
            dataKey="Date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            minTickGap={48}
            dy={8}
          />

          <YAxis
            domain={[yMin, yMax]}
            ticks={yTicks}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => v.toFixed(1)}
            width={38}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "var(--accent)", strokeWidth: 1, strokeDasharray: "4 3", opacity: 0.5 }}
          />

          <ReferenceLine
            y={stats.avg}
            stroke="var(--text-muted)"
            strokeDasharray="5 4"
            strokeWidth={1}
          />

          <Area
            type="monotone"
            dataKey="GHI"
            stroke="var(--accent)"
            strokeWidth={2}
            fill={`url(#${gradId})`}
            dot={isLarge ? false : <DataDot />}
            activeDot={{ r: 5, fill: "var(--accent)", stroke: "var(--bg-base)", strokeWidth: 2 }}
            isAnimationActive={!isLarge}
            animationDuration={600}
            animationEasing="ease-out"
          />

          {isSelecting && zoomLeft && zoomRight && (
            <ReferenceArea
              x1={zoomLeft}
              x2={zoomRight}
              fill="var(--accent)"
              fillOpacity={0.07}
              stroke="var(--accent)"
              strokeOpacity={0.3}
              strokeWidth={1}
            />
          )}
        </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.footer}>
        <span className={styles.legendItem}>
          <span className={styles.legendDash} />
          Avg&nbsp;<span className={styles.legendValue}>{stats.avg.toFixed(2)}</span>
        </span>
        <span className={styles.legendSep} aria-hidden="true">·</span>
        <span className={styles.legendItem}>
          <span className={styles.legendAmberDot} />
          Peak&nbsp;<span className={styles.legendValue}>{stats.max.toFixed(2)}</span>
        </span>
      </div>
    </div>
  );
}