import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MetricCard from "./MetricCard";

export default function SortableMetricCard({metric,size,onToggleVisibility,onToggleSize,}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: metric.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 2 : 1,
    gridColumn: size === "wide" ? "span 2" : "span 1",
  };

  return (
    <div ref={setNodeRef} style={style}className={`metric-wrapper ${isDragging ? "dragging" : ""}`}>
      <div className="metric-toolbar">
        <button type="button" className="drag-handle"aria-label={`Drag ${metric.title}`}{...attributes} {...listeners}>
          ⠿
        </button>
        <div className="metric-actions">
          <button type="button" className="resize-button" onClick={() => onToggleSize(metric.id)} title={size === "wide" ? "Make card normal size" : "Make card wide"}>
            {size === "wide" ? "↙" : "↗"}
          </button>
          <button type="button" className="visibility-button"
            aria-label={`Hide ${metric.title}`}
            onClick={() => onToggleVisibility(metric.id)}
          >
            Hide
          </button>
        </div>
      </div>
      <MetricCard metric={metric} />
    </div>
  );
}