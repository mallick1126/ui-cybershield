import PropTypes from "prop-types";
import "./Dialog.css";

const Dialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="dialog" aria-modal="true" role="dialog">
      <div className="dialog-content">
        <p>{message}</p>
        <div className="dialog-actions">
          <button onClick={onConfirm} className="button yes" tabIndex={0}>
            Yes
          </button>
          <button onClick={onCancel} className="button cancel" tabIndex={0}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

Dialog.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Dialog;
