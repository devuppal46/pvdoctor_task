import styles from "./StatCard.module.css";

export default function StatCard({ label, value }) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        {value.toFixed(2)}
      </span>
      <span className={styles.unit}>kWh / m²</span>
    </div>
  );
}
