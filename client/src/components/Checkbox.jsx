// Checkbox.jsx
import PropTypes from "prop-types";

function Checkbox({ checked = false, onClick }) {
  return (
    <div onClick={onClick}>
      {!checked && (
        <div className="checkbox unchecked">
          <img src="/primary-circle.svg" alt="" />
        </div>
      )}
      {checked && (
        <div className="checkbox checked">
          <img src="/check-circle.png" alt="" />
        </div>
      )}
    </div>
  );
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Checkbox;
