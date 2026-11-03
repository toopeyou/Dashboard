export default function AddCardModal({metrics,layout,hidden,onAdd,onRemove,onClose}) {
  return (
    <div className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {onClose();}
      }}
    >
      <section className="modal" >
        <div className="modal-header">
          <div>
            <h2>Manage widgets</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="widget-list">
          {metrics.map((metric) => {
            const isAdded = layout.includes(metric.id);
            const isHidden = hidden.includes(metric.id);
            return (
              <div className="widget-option" key={metric.id}>
                <div className={`metric-icon ${metric.color}`}>
                  {metric.icon}
                </div>

                <div className="widget-option-info">
                  <strong>{metric.title}</strong>
                  <span>
                    {isAdded
                      ? isHidden
                      ? "Hidden"
                      : "Added to dashboard"
                      : metric.description}
                  </span>
                </div>
                {isAdded ? (
                  <button className="widget-action remove" onClick={() => onRemove(metric.id)}>
                    Remove
                  </button>
                ) : (
                  <button className="widget-action add" onClick={() => onAdd(metric.id)}>
                    + Add
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="modal-footer">
          <span>{layout.length} widgets confegured</span>
          <button className="done-button" onClick={onClose}>save</button>
        </div>
      </section>
    </div>
  );
}
