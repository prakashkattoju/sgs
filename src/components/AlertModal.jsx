export default function AlertModal({ show, title, message, onClose }) {
  return (
    <div
      className={`dfc-modal modal fade ${show ? "show d-flex" : ""}`}
      id="AlertModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            {/* <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button> */}
            <h4 className="modal-title">{title || "Alert"}</h4>
          </div>
          <div className="modal-body">
            <p>{message || "Something happend"}</p>
          </div>
          <div className="modal-footer">
            <button className="btn" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};