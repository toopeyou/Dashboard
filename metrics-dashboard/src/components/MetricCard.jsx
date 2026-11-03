import { useEffect, useState } from "react";
import { fetchMetric } from "../api/metricsApi";

function formatValue(metric) {
  if (metric.id === "revenue") {
    return `$${metric.value.toLocaleString("en-US")}`;
  }

  if (metric.id === "conversion") {
    return `${metric.value.toFixed(2)}%`;
  }

  return metric.value.toLocaleString("en-US");
}

export default function MetricCard({ metric }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const result = await fetchMetric(metric.id);
      setData(result);
    } catch {
      setError("Failed to load metric data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [metric.id]);

  if (loading) {
    return (
      <div className="metric-card skeleton-card">
        <div className="skeleton skeleton-icon" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-value" />
        <div className="skeleton skeleton-footer" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="metric-card error-card">
        <div className="metric-icon">{metric.icon}</div>
        <h3>{metric.title}</h3>
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={loadData}>
          Try again
        </button>
      </div>
    );
  }
  const isPositive = data.change >= 0;

  return (
    <div className="metric-card">
      <div className="metric-card-top">
        <div className={`metric-icon ${data.color}`}>
          {data.icon}
        </div>

        <span className={`metric-change ${isPositive ? "positive" : "negative"}`}>
          {isPositive ? "↗" : "↘"} {Math.abs(data.change)}%
        </span>
      </div>

      <div className="metric-info">
        <p className="metric-title">{data.title}</p>
        <h2 className="metric-value">
          {formatValue(data)}
        </h2>
        <p className="metric-description">
          {data.description}
        </p>
      </div>
    </div>
  );
}