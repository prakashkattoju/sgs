export default function ConfirmModal({ show, title, message, onConfirm, onConfirmLabel, onCancel, onCancelLabel="No" }) {
  return (
    <div
      className={`dfc-modal modal fade ${show ? "show d-flex" : ""}`}
      id="ConfirmModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            {/* <button
              type="button"
              className="btn-close"
              onClick={onCancel}
            ></button> */}
            <h4 className="modal-title">{title || "Confirm Action"}</h4>
          </div>
          <div className="modal-body">
            <p>{message || "Are you sure you want to proceed?"}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>
              {onCancelLabel || "No"}
            </button>
            <button className="btn" onClick={onConfirm}>
              {onConfirmLabel || "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};