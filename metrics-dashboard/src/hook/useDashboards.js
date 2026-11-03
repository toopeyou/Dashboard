import { useState } from "react";
import { getAvailableMetrics } from "../api/metricsApi";

const STORAGE_KEY = "metrics-dashboard-layout";

const defaultLayout = {
  version: 1,
  layout: ["views", "followers", "revenue", "orders", "conversion"],
  hidden: [],
  sizes: {},
};

function loadLayout() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return defaultLayout;

    const parsed = JSON.parse(saved);
    const availableIds = getAvailableMetrics().map((metric) => metric.id);

    if (
      parsed.version !== 1 ||
      !Array.isArray(parsed.layout) ||
      !Array.isArray(parsed.hidden)
    ) {
      return defaultLayout;
    }

    const layout = [
      ...new Set(
        parsed.layout.filter((id) => availableIds.includes(id))
      ),
    ];

    const hidden = [
      ...new Set(
        parsed.hidden.filter((id) => layout.includes(id))
      ),
    ];

    const sizes = {};

    if (
      parsed.sizes &&
      typeof parsed.sizes === "object" &&
      !Array.isArray(parsed.sizes)
    ) {
      for (const [id, size] of Object.entries(parsed.sizes)) {
        if (layout.includes(id) && (size === "normal" || size === "wide")) {
          sizes[id] = size;
        }
      }
    }

    return {
      version: 1,
      layout,
      hidden,
      sizes,
    };
  } catch {
    return defaultLayout;
  }
}
export default function useDashboardLayout() {
  const [config, setConfig] = useState(loadLayout);

  function toggleCardSize(id) {
    updateConfig((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [id]: prev.sizes?.[id] === "wide" ? "normal" : "wide",
      },
    }));
  }
  function updateConfig(updater) {
    setConfig((previous) => {
      const next =
        typeof updater === "function" ? updater(previous) : updater;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.error("Failed to save dashboard layout:", error);
      }

      return next;
    });
  }

  function addCard(id) {
    updateConfig((previous) => {
      if (previous.layout.includes(id)) {
        return {
          ...previous,
          hidden: previous.hidden.filter((item) => item !== id),
        };
      }

      return {
        ...previous,
        layout: [...previous.layout, id],
      };
    });
  }

  function removeCard(id) {
    updateConfig((previous) => ({
      ...previous,
      layout: previous.layout.filter((item) => item !== id),
      hidden: previous.hidden.filter((item) => item !== id),
    }));
  }

  function toggleVisibility(id) {
    updateConfig((previous) => ({
      ...previous,
      hidden: previous.hidden.includes(id)
        ? previous.hidden.filter((item) => item !== id)
        : [...previous.hidden, id],
    }));
  }

  function reorderCards(newLayout) {
    updateConfig((previous) => ({
      ...previous,
      layout: newLayout,
    }));
  }

return {
  config,
  addCard,
  removeCard,
  toggleVisibility,
  reorderCards,
  toggleCardSize,
};
}


