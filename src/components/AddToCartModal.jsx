export default function AddToCartModal({ show, setWeight, onConfirm, onCancel }) {
  return (
    <div
      className={`dfc-modal modal fade ${show ? "show d-flex" : ""}`}
      id="AddToCartModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            <p>{"Select Quantity and Add to Cart"}</p>
            <div className="form-group">
                
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>
              {"Cancel"}
            </button>
            <button className="btn" onClick={onConfirm}>
              {"Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};