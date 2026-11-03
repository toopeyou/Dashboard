const metrics = {
  views: {
    id: "views",
    title: "Page Views",
    value: 24852,
    change: 12.8,
    icon: "👁️",
    color: "blue",
    description: "Total page views",
  },
  followers: {
    id: "followers",
    title: "Followers",
    value: 8420,
    change: 8.2,
    icon: "👥",
    color: "purple",
    description: "Total followers",
  },
  revenue: {
    id: "revenue",
    title: "Revenue",
    value: 12450,
    change: 15.4,
    icon: "💰",
    color: "green",
    description: "Total earnings",
  },
  orders: {
    id: "orders",
    title: "Orders",
    value: 1248,
    change: -2.4,
    icon: "📦",
    color: "orange",
    description: "Total orders",
  },
  conversion: {
    id: "conversion",
    title: "Conversion Rate",
    value: 3.68,
    change: 5.7,
    icon: "📈",
    color: "pink",
    description: "Visitors converted",
  },
};

export const getAvailableMetrics = () => {
  return Object.values(metrics);
};

export const fetchMetric = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const metric = metrics[id];

      if (!metric) {
        reject(new Error("Metric not found"));
        return;
      }
      resolve({
        ...metric,
        value:
          metric.id === "revenue"
            ? metric.value + Math.floor(Math.random() * 500)
            : metric.value + Math.floor(Math.random() * 100),
      });
    }, 700 + Math.random() * 800);
  });
};











































