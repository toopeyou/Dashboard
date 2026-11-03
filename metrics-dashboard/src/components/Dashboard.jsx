import { useState } from "react";

import useTheme from "../hook/useTheme";
import { DndContext, PointerSensor, KeyboardSensor, closestCenter, useSensor, useSensors} from "@dnd-kit/core";
import {SortableContext,rectSortingStrategy,sortableKeyboardCoordinates, arrayMove,} from "@dnd-kit/sortable";
import SortableMetricCard from "./SortableMetricCard";
import AddCardModal from "./AddCard";
import { getAvailableMetrics } from "../api/metricsApi";
import useDashboardLayout from "../hook/useDashboards";

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const metrics = getAvailableMetrics();
 const {
  config,
  addCard,
  removeCard,
  toggleVisibility,
  reorderCards,
  toggleCardSize,
} = useDashboardLayout();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 6,},}),
    useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates,})
  );

  const visibleMetrics = config.layout
    .filter((id) => !config.hidden.includes(id))
    .map((id) => metrics.find((metric) => metric.id === id))
    .filter(Boolean);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = config.layout.indexOf(active.id);
    const newIndex = config.layout.indexOf(over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    reorderCards(arrayMove(config.layout, oldIndex, newIndex));
  };

  return (
    <main className="dashboard">
      <div className="dashboard-heading">
        <div>
          <p >OVERVIEW</p>
        </div>
        <div className="dashboard-actions">
          <button className="manage-button"onClick={() => setIsModalOpen(true)}>
            Widgets
          </button>
          <button className="add-widget-button"onClick={() => setIsModalOpen(true)}>
            + Add Widget
          </button>
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? "☀️ Light theme" : "🌙 Dark theme"}
          </button>
        </div>
      </div>

      {config.hidden.length > 0 && (
        <div className="hidden-widgets">
          <span>Hidden widgets:</span>
          
          {config.layout
            .filter((id) => config.hidden.includes(id))
            .map((id) => {
              const metric = metrics.find((item) => item.id === id);
              if (!metric) return null;
              return (
                <button key={id} className="restore-widget" onClick={() => toggleVisibility(id)}>
                  + {metric.title}
                </button>
              );
            })}
        </div>
      )}

      {visibleMetrics.length > 0 ? (
        <DndContext sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={visibleMetrics.map((metric) => metric.id)} strategy={rectSortingStrategy}>
            <section className="metrics-grid">
             {visibleMetrics.map((metric) => (
                <SortableMetricCard
                  key={metric.id}
                  metric={metric}
                  size={config.sizes?.[metric.id] ?? "normal"}
                  onToggleVisibility={toggleVisibility}
                  onToggleSize={toggleCardSize}
                />
              ))}
            </section>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="empty-state">
          <h3>Your dashboard is empty</h3>
          <button className="add-widget-button" onClick={() => setIsModalOpen(true)}>
            + Add Widget
          </button>
        </div>
      )}

      {isModalOpen && (
        <AddCardModal
          metrics={metrics}
          layout={config.layout}
          hidden={config.hidden}
          onAdd={addCard}
          onRemove={removeCard}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}